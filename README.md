# Painel de Bem-Estar

Este é um painel fitness moderno, inspirado no Material Design, com dashboard, temas claro/escuro, animações e páginas de treinos.

## Estrutura de Pastas

```
assets/
  dashboard.css      # Estilos globais
  dashboard.js       # Scripts globais
  img/               # Imagens do site
pasttreinos/
  costas/
    tcostas/         # Detalhes de treinos de costas
  peito/
    tpeito/          # Detalhes de treinos de peito
  ombro/
    tombro/          # Detalhes de treinos de ombro
  pernas/
    tpernas/         # Detalhes de treinos de pernas
index.html           # Dashboard principal
mapacorpo.html       # Guia de músculos
...
```

## Como rodar localmente

1. Baixe/clique duas vezes no `index.html` para abrir no navegador.
2. Para recursos dinâmicos (ex: API de clima), hospede localmente com um servidor simples:
   ```
   npx serve .
   # ou
   python3 -m http.server
   ```
3. Acesse `http://localhost:8000` no navegador.

## Customização
- Edite `assets/dashboard.css` para mudar cores, fontes e temas.
- Adicione novas páginas de treino em `pasttreinos/` seguindo o padrão dos arquivos existentes.
- Imagens devem ser colocadas em `assets/img/` e referenciadas nos HTMLs.

## Autor
Site criado e idealizado por Vitor Gurgel. 