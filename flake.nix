{
  description = "Nodejs typescript development shell (nix shell)";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import (inputs.nixpkgs) {inherit system;};
      in {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodePackages.nodejs
            nodePackages.pnpm

            # Neovim editor dependencies
            vtsls
            tailwindcss-language-server
            nodePackages.vscode-json-languageserver
            nodePackages.vscode-langservers-extracted
            eslint_d
            prettierd

            # tools
            bruno
          ];

          shellHook = ''
            echo "Nodejs dev shell activated! Happy coding 🚀."
          '';
        };
      }
    );
}
