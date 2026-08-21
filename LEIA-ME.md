# Barbearia Martins — site

Arquivo principal: **`index.html`**. É um site de página única, sem dependências —
dá pra abrir com dois cliques ou subir em qualquer hospedagem.

---

## Dados que já estão no site

| | |
|---|---|
| Agendamento online | https://cashbarber.com.br/Martins |
| WhatsApp | (31) 98280-0596 |
| Instagram | @barbeariamartins.0 |
| Endereço | Rua do Catete, 411 — Centro, Mariana/MG |
| Horário | Terça a sábado, 08h às 22h |
| Barbeiro | Moisés Martins |

> ⚠️ **Conferir o horário com o dono.** O site está com **terça a sábado, 8h–22h**
> (o que o Rafael passou). Mas a arte publicada no Instagram deles diz
> **terça a sexta 9h–20h e sábado 8h–17h**. Um dos dois está desatualizado.

**Os botões seguem duas rotas diferentes, de propósito:**

- **Agendar** (menu, topo, endereço, botão flutuante e fechamento) → abre a agenda
  online no CashBarber, onde o cliente escolhe dia e horário sozinho.
- **Consultar valor / orçamento / dúvida** → abre o WhatsApp com a mensagem já escrita.
  Cada serviço manda uma mensagem diferente: quem clica em "barba" já chega
  perguntando pela barba.

A separação existe porque prótese precisa de conversa e orçamento antes,
enquanto corte e barba a pessoa resolve sozinha na agenda.

---

## As fotos de prótese

Ficam em `assets/protese/` e já estão no site:

- `antes-depois.jpg` — o antes/depois que aparece grande na seção de prótese
- `1.jpg` — cliente antes da aplicação
- `2.jpg` e `3.jpg` — resultados finalizados

Vieram do Instagram da própria barbearia (@barbeariamartins.0). Para trocar,
é só substituir os arquivos mantendo os mesmos nomes.

---

## Adicionar as fotos dos cortes

A galeria **aparece sozinha** quando existirem fotos. Enquanto não tiver nenhuma,
a seção fica escondida e o site não mostra espaço vazio.

Para ligar:

1. Coloque as fotos na pasta `assets/fotos/`
2. Nomeie como `1.jpg`, `2.jpg`, `3.jpg`… até `8.jpg`
3. Pronto — pode colocar só 3 se quiser, as que faltarem somem sozinhas

Dica: use fotos quadradas (ou perto disso). Antes/depois de prótese funcionam muito bem aqui.

---

## Adicionar vídeos do Instagram

A seção "Vídeos recentes" também **aparece sozinha** — enquanto nenhum link for colado,
fica escondida.

Para ligar:

1. Abra o Reels no app ou no site do Instagram (@barbeariamartins.0)
2. Toque nos três pontinhos (⋯) → **Copiar link**
3. No `index.html`, procure por `COLE-O-LINK-DO-REEL-AQUI` (aparecem 3 vezes)
4. Troque cada um pelo link copiado, entre as aspas de `data-instgrm-permalink="..."`
5. Salve — o vídeo aparece embutido de verdade (é o player oficial do Instagram, não um link)

Só tem 3 espaços prontos no arquivo. Se quiser mais, duplique a linha
`<blockquote class="instagram-media" ...></blockquote>` dentro da `<div class="vids" id="vids">`
e cole outro link.

Precisa ser um Reels ou post **público** — se a conta virar privada, o vídeo para de aparecer.

---

## Trocar a logo

A logo usada é `assets/logo.png` (recorte quadrado do brasão).

Se um dia tiver uma versão nova:

1. Salve o arquivo em `assets/` com o nome começando em `logo-original`
2. Rode no terminal:

```bash
python preparar-logo.py
```

O script acha o brasão sozinho, recorta e regrava o `logo.png`.

---

## Editar textos, horário ou endereço

Abra o `index.html` em qualquer editor de texto e procure pelo trecho que quer mudar.
O arquivo está comentado em português.

Se mudar o horário, atualize **quatro lugares**:

1. A tabela na seção "Onde e quando"
2. As constantes `ABRE` e `FECHA` no JavaScript no fim do arquivo
   — é o que faz o aviso "Aberto agora / Fechado" funcionar sozinho
3. O texto do rodapé
4. O bloco `application/ld+json` no topo do arquivo — é o que o Google lê

O comentário no início do `index.html` repete essa lista, pra não esquecer.

---

## Detalhes que valem conhecer

- **Aviso de aberto/fechado**: calcula pelo relógio do celular de quem acessa e
  atualiza a cada minuto. Também destaca o dia de hoje na tabela de horários.
- **Botão flutuante**: acompanha a rolagem. No celular vira só o ícone, pra não atrapalhar.
- **Fontes**: Oswald e Inter, carregadas do Google Fonts. Sem internet o site continua
  funcionando, só troca por fontes parecidas do sistema.
- **Menu no celular**: o botão de três riscos abre os links. Fecha ao escolher um item,
  ao tocar fora ou apertando Esc.
- **Dados estruturados**: tem um bloco `application/ld+json` no topo que informa ao Google
  o tipo de negócio, endereço, telefone, horário e lista de serviços. É o que faz aparecer
  o cartão com horário e "como chegar" direto no resultado de busca.

---

## Ao publicar (GitHub Pages ou outra hospedagem)

Duas coisas que só dá pra ajustar quando o site tiver endereço definitivo:

1. No bloco `application/ld+json`, troque `"image": "assets/logo.png"` pela URL completa
   (ex.: `https://seusite.com/assets/logo.png`) e acrescente `"url"` com o endereço do site.
2. Faça o mesmo em `<meta property="og:image">` — é a miniatura que aparece quando
   alguém compartilha o link no WhatsApp. Com caminho relativo, alguns apps não mostram.
