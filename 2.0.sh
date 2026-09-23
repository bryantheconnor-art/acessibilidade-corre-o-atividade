#!/bin/bash
set -e

ARQUIVO="/etc/network/interfaces"

echo "📝 Configurando rede estática..."

# > sobrescreve o arquivo (começa do zero)
echo "auto lo" > "$ARQUIVO"
echo "iface lo inet loopback" >> "$ARQUIVO"
echo "" >> "$ARQUIVO"
echo "auto eth0" >> "$ARQUIVO"
echo "iface eth0 inet static" >> "$ARQUIVO"
echo "    address 192.168.1.100" >> "$ARQUIVO"
echo "    netmask 255.255.255.0" >> "$ARQUIVO"
echo "    gateway 192.168.1.1" >> "$ARQUIVO"
echo "    dns-nameservers 8.8.8.8 8.8.4.4" >> "$ARQUIVO"

echo "✅ Arquivo $ARQUIVO escrito com sucesso!"
echo ""
echo "📄 Conteúdo atual:"
cat "$ARQUIVO"