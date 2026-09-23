#!/bin/bash
set -e

echo "========================================="
echo "  INTERFACES DE REDE"
echo "========================================="
echo ""

#IP
ip -br addr show

#interfaces
ip -br addr show | grep -v "^lo"

#gateway
ip route show default

#servidores DNS
cat /etc/resolv.conf | grep "^nameserver" || echo "Nenhum DNS encontrado"