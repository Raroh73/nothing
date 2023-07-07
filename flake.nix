{
  description = "Nothing";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, flake-utils, nixpkgs }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          devShells.default = pkgs.mkShell
            {
              nativeBuildInputs = with pkgs;
                [
                  cargo
                  cargo-tauri
                  clippy
                  glib
                  gtk3
                  libsoup
                  nodejs
                  pkg-config
                  rustc
                  rustfmt
                  webkitgtk
                ];
            };
        });
}
