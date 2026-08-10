# -*- coding: utf-8 -*-
"""
PREPARAR LOGO — Barbearia Martins
=================================
O que faz: pega a imagem original do logo (badge + "Faça seu Agendamento"),
recorta SÓ o brasão circular de cima e salva como assets/logo.png,
no formato quadrado que o site espera.

COMO USAR
  1. Salve a imagem do logo em:  assets/logo-original.png
     (pode ser .png, .jpg ou .webp — o nome só precisa começar com "logo-original")
  2. Rode:   python preparar-logo.py
  3. Pronto. O site já vai mostrar o logo real.

Se a imagem que você salvar JÁ for só o brasão (sem o texto embaixo),
o script detecta isso sozinho e apenas ajusta o enquadramento.
"""
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Falta a biblioteca Pillow. Rode:  python -m pip install pillow")

BASE = Path(__file__).parent
ASSETS = BASE / "assets"
SAIDA = ASSETS / "logo.png"

BRILHO_MIN = 55      # a partir de que tom um pixel conta como "desenho"
MIN_LINHAS = 8       # ignora ruído: banda precisa ter ao menos N linhas
MARGEM = 0.06        # respiro ao redor do brasão (6% do lado)


def achar_origem() -> Path:
    candidatos = [
        p for p in ASSETS.glob("*")
        if p.is_file()
        and p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
        and p.name.lower() != "logo.png"
    ]
    if not candidatos:
        sys.exit(
            "Nenhuma imagem encontrada em assets/.\n"
            "Salve o logo como:  assets/logo-original.png  e rode de novo."
        )
    # prioriza quem se chama logo-original
    for p in candidatos:
        if p.stem.lower().startswith("logo-original"):
            return p
    return max(candidatos, key=lambda p: p.stat().st_size)


def bandas_de_conteudo(cinza, larg, alt):
    """Devolve faixas verticais (y0, y1) que contêm desenho, de cima pra baixo."""
    px = cinza.load()
    linhas_com_traco = []
    for y in range(alt):
        claros = 0
        for x in range(0, larg, 2):          # amostra 1 a cada 2 colunas: rápido e suficiente
            if px[x, y] >= BRILHO_MIN:
                claros += 1
                if claros > larg * 0.004:     # linha "tem conteúdo"
                    break
        linhas_com_traco.append(claros > larg * 0.004)

    bandas, ini = [], None
    for y, tem in enumerate(linhas_com_traco):
        if tem and ini is None:
            ini = y
        elif not tem and ini is not None:
            if y - ini >= MIN_LINHAS:
                bandas.append((ini, y))
            ini = None
    if ini is not None and alt - ini >= MIN_LINHAS:
        bandas.append((ini, alt))
    return bandas


def limites_horizontais(cinza, y0, y1, larg):
    px = cinza.load()
    x_min, x_max = larg, 0
    for y in range(y0, y1, 2):
        for x in range(larg):
            if px[x, y] >= BRILHO_MIN:
                if x < x_min:
                    x_min = x
                break
        for x in range(larg - 1, -1, -1):
            if px[x, y] >= BRILHO_MIN:
                if x > x_max:
                    x_max = x
                break
    return (x_min, x_max) if x_max > x_min else (0, larg - 1)


def main():
    origem = achar_origem()
    print(f"Imagem de origem : {origem.name}")

    img = Image.open(origem).convert("RGB")
    larg, alt = img.size
    print(f"Tamanho original : {larg}x{alt}")

    cinza = img.convert("L")
    bandas = bandas_de_conteudo(cinza, larg, alt)
    if not bandas:
        sys.exit("Não consegui identificar o desenho na imagem (fundo muito claro?).")

    print(f"Blocos de desenho: {len(bandas)}")

    # o brasão é sempre o primeiro bloco de cima pra baixo
    y0, y1 = bandas[0]

    # se o primeiro bloco for baixo demais, é ruído — junta com o próximo
    if (y1 - y0) < alt * 0.12 and len(bandas) > 1:
        y1 = bandas[1][1]

    x0, x1 = limites_horizontais(cinza, y0, y1, larg)

    # quadrado, centralizado no brasão, com margem
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    lado = max(x1 - x0, y1 - y0) * (1 + MARGEM * 2)
    meia = lado / 2

    cx = min(max(cx, meia), larg - meia) if lado <= larg else larg / 2
    cy = min(max(cy, meia), alt - meia) if lado <= alt else alt / 2

    caixa = (
        int(max(0, cx - meia)), int(max(0, cy - meia)),
        int(min(larg, cx + meia)), int(min(alt, cy + meia)),
    )

    recorte = img.crop(caixa)
    if recorte.width > 900:
        novo = (900, round(900 * recorte.height / recorte.width))
        recorte = recorte.resize(novo, Image.LANCZOS)

    ASSETS.mkdir(exist_ok=True)
    recorte.save(SAIDA, "PNG", optimize=True)

    print(f"Recorte          : {caixa}")
    print(f"Salvo em         : {SAIDA}  ({recorte.width}x{recorte.height})")
    print("\nPronto! Abra o index.html — o logo real já está no site.")


if __name__ == "__main__":
    main()
