# Sistema de localização

esse sistema serve pra armazenar traduções e oferecer a versão apropriada para o aplicativo.

## traduções

as traduções se encontram no arquivo ```./data.js``` no array ```translations``` .

Os elementos tem o seguinte formato

```
{
  key: string,
  translations : {
    [string]: string
  }[]
}
```

a propriedade ```key``` é a que deve ser utilizada de referencia para acessar a tradução. A escolha da lingua é feita por meio do método do módulo.

Para incluir novas traduções basta adicionar um novo objeto ao array seguindo o mesmo formato.

## como utilizar a localização

Para utilizar o sistema no aplicativo, primeiro é necessário colocar o aplicativo como filho do ```LocalizationProvider```.

```
<LocalizationProvider>
 <App />
</LocalizationProvider>
```

Depois pode-se utilizar o ```useLocalization``` hook para acessar as traduções pelas ```key```.

```
const Button = () => {
  const { translations } = useLocalization()

  return (
    <button>{translations.button_key}</button>
  )
}
```

## como mudar de lingua

O hook ```useLocalization``` expões uma função para mudar a lingua.

É uma boa utilizar constantes exportadas pelo módulo para o nome das linguas pra evitar erros.


```
import { portugues, useLocalization } from './useLocalization'

const PtButton = () => {
  const { translations } = useLocalization()

  return (
    <button onClick={() => changeLanguage(portugues)}>PT - BR</buttton>
  )
}
```