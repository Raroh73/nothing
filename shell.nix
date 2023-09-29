let
  pkgs = import <nixpkgs> { };
  libraries = with pkgs;[
    webkitgtk
    gtk3
    cairo
    gdk-pixbuf
    glib
    dbus
    openssl
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
    shellHook = ''
      export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath libraries}:$LD_LIBRARY_PATH
    '';
  };
}
