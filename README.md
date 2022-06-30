# Vamoss exp

### instalar

```
yarn
```

### rodar local

```
yarn serve
```

## Estrutura do aplicativo

O aplicativo abre duas janelas.
Uma com o editor de codigo e outra com o visualizador.

### src

Na pasta /src está o código para as paginas carregadas nas janelas do aplicativo.

É um aplicativo em React com rotas diferentes paras as views.

### public

Na pasta /public estão os assets utilizados pelo aplicativo, assim como a parte em node.
A parte em node se encontra na pasta /public/main, lá também são salvos os conteúdos das sketches.

Arquivos salvos pelo editor vão para a pasta /public/main/data/derivados. Assim eles ficam disponíveis para o visualizador carregar as sketches.
