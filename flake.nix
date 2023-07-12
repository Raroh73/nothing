{
  description = "Nothing";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, flake-utils, nixpkgs }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        libraries = with pkgs;[
          cairo
          dbus
          gdk-pixbuf
          glib
          gtk3
          librsvg
          openssl
          webkitgtk
        ];
        packages = with pkgs; [
          cargo
          cargo-tauri
          clippy
          curl
          dbus
          glib
          gtk3
          librsvg
          libsoup
          nodejs_latest
          openssl
          pkg-config
          rustc
          rustfmt
          webkitgtk
          wget
        ];
      in
      {
        devShell = pkgs.mkShell {
          nativeBuildInputs = packages;
          shellHook =
            ''
              export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath libraries}:$LD_LIBRARY_PATH
            '';
        };
      });
}
