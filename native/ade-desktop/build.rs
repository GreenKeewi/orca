fn main() {
    println!("cargo:rerun-if-changed=runtime-manifest.json");
    let manifest = std::fs::read("runtime-manifest.json");
    #[cfg(feature = "desktop")]
    if manifest.is_err() {
        panic!("Run pnpm stage:ade-desktop before compiling the desktop host");
    }
    let output = std::path::PathBuf::from(std::env::var_os("OUT_DIR").unwrap());
    std::fs::write(
        output.join("runtime-manifest.json"),
        manifest.unwrap_or(b"{}".to_vec()),
    )
    .unwrap();
    #[cfg(feature = "desktop")]
    tauri_build::try_build(
        tauri_build::Attributes::new()
            .app_manifest(tauri_build::AppManifest::new().commands(&["ade_runtime_bootstrap"]))
            .windows_attributes(
                tauri_build::WindowsAttributes::new()
                    .window_icon_path("../../resources/build/icon.ico"),
            ),
    )
    .expect("Could not validate ADE native assets and command permissions");
}
