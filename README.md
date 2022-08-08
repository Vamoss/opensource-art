# Vamoss exp

### instalar

```
yarn
```

### rodar local

```
yarn serve
```

### deletar os dados persistentes e rodar o app

Esse comando vai perder todas as sketches geradas até então.
Usar com cuidado.

```
yarn fresh-start
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

# Como setar a instalação em uma máquina

1 - instalar nodejs e yarn

2 - instalar as dependencias

```
yarn
```

3 - colocar o código da sketch mãe no arquivo.

/public/main/data/initial/initial/sketch.js

4 - rodar aplicação

```
yarn serve
```
