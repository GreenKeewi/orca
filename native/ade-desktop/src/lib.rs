use serde::Deserialize;
use serde_json::Value;
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;
use std::path::{Component, Path, PathBuf};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeManifest {
    pub node: String,
    pub launcher: String,
    pub files: BTreeMap<String, String>,
}

pub fn verified_path(root: &Path, relative: &str) -> Result<PathBuf, String> {
    let path = Path::new(relative);
    if path
        .components()
        .any(|part| !matches!(part, Component::Normal(_)))
        || path.as_os_str().is_empty()
    {
        return Err("Runtime resource path must be relative".into());
    }
    let root = root
        .canonicalize()
        .map_err(|_| "Missing packaged runtime")?;
    let resolved = root
        .join(path)
        .canonicalize()
        .map_err(|_| "Missing runtime resource")?;
    if !resolved.starts_with(root) {
        return Err("Runtime resource escaped its package".into());
    }
    Ok(resolved)
}

pub fn verify_runtime(
    root: &Path,
    manifest: &RuntimeManifest,
) -> Result<(PathBuf, PathBuf), String> {
    if manifest.files.is_empty()
        || !manifest.files.contains_key(&manifest.node)
        || !manifest.files.contains_key(&manifest.launcher)
    {
        return Err("Incomplete runtime manifest".into());
    }
    for (relative, expected) in &manifest.files {
        let bytes = std::fs::read(verified_path(root, relative)?)
            .map_err(|_| "Unreadable runtime resource")?;
        if format!("{:x}", Sha256::digest(bytes)) != *expected {
            return Err(format!("Packaged runtime integrity mismatch: {relative}"));
        }
    }
    Ok((
        verified_path(root, &manifest.node)?,
        verified_path(root, &manifest.launcher)?,
    ))
}

pub fn validate_readiness(value: &Value, nonce: &str, pid: u32) -> Result<(), String> {
    if value["type"] != "orca_server_ready"
        || value["schemaVersion"] != 1
        || value["desktopParent"]["protocolVersion"] != 1
        || value["desktopParent"]["nonce"] != nonce
        || value["health"]["pid"] != pid
        || value["pairing"]["available"] != true
        || value["pairing"]["scope"] != "runtime"
        || value["runtimeId"].as_str().is_none_or(str::is_empty)
    {
        return Err("Owned runtime handshake refused".into());
    }
    let endpoint = value["boundEndpoint"]
        .as_str()
        .ok_or("Missing local endpoint")?;
    let raw_endpoint = endpoint;
    let endpoint = url::Url::parse(endpoint).map_err(|_| "Invalid local endpoint")?;
    if endpoint.scheme() != "ws"
        || endpoint.host_str() != Some("127.0.0.1")
        || endpoint.port().is_none()
        || !endpoint.username().is_empty()
        || endpoint.password().is_some()
        || value["pairing"]["endpoint"].as_str() != Some(raw_endpoint)
    {
        return Err("Runtime must bind its own loopback endpoint".into());
    }
    if !value["pairing"]["url"]
        .as_str()
        .is_some_and(|url| url.starts_with("orca://pair?code="))
    {
        return Err("Missing runtime pairing offer".into());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn readiness() -> Value {
        json!({"type":"orca_server_ready", "schemaVersion":1, "runtimeId":"owned-runtime",
            "desktopParent":{"protocolVersion":1,"nonce":"nonce"},"health":{"pid":42},
            "boundEndpoint":"ws://127.0.0.1:12345/", "pairing":{"available":true,"scope":"runtime",
            "endpoint":"ws://127.0.0.1:12345/","url":"orca://pair?code=local"}})
    }

    #[test]
    fn rejects_foreign_process_nonce_and_nonlocal_endpoints() {
        let value = readiness();
        assert!(validate_readiness(&value, "nonce", 42).is_ok());
        assert!(validate_readiness(&value, "old-nonce", 42).is_err());
        assert!(validate_readiness(&value, "nonce", 43).is_err());
        let mut remote = value;
        remote["boundEndpoint"] = json!("ws://192.168.1.5:12345/");
        assert!(validate_readiness(&remote, "nonce", 42).is_err());
    }

    #[test]
    fn detects_changed_packaged_runtime_bytes() {
        let unique = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "ade-runtime-integrity-{}-{unique}",
            std::process::id()
        ));
        std::fs::create_dir(&root).unwrap();
        std::fs::write(root.join("node"), b"pinned node").unwrap();
        std::fs::write(root.join("orcad.js"), b"pinned launcher").unwrap();
        let files = BTreeMap::from([
            (
                "node".into(),
                format!("{:x}", Sha256::digest(b"pinned node")),
            ),
            (
                "orcad.js".into(),
                format!("{:x}", Sha256::digest(b"pinned launcher")),
            ),
        ]);
        let manifest = RuntimeManifest {
            node: "node".into(),
            launcher: "orcad.js".into(),
            files,
        };
        assert!(verify_runtime(&root, &manifest).is_ok());
        std::fs::write(root.join("node"), b"substituted runtime").unwrap();
        assert!(verify_runtime(&root, &manifest).is_err());
        std::fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn rejects_path_escape_and_unverified_launchers() {
        assert!(verified_path(Path::new("."), "../other/orcad.js").is_err());
        assert!(verified_path(Path::new("."), "/tmp/orcad.js").is_err());
        let manifest = RuntimeManifest {
            node: "node".into(),
            launcher: "orcad.js".into(),
            files: BTreeMap::new(),
        };
        assert!(verify_runtime(Path::new("."), &manifest).is_err());
    }
}
