# Aplicativo de fidelidade #
Aplicativo feito em React-native


## Bugs Conhecidos ##

##1. Login com Facebook##
###Container responsável: StartContainer###
Ao tentar logar via facebook, utilizando o graphRequest ~~necessário para funcionamento da api~~, conseguimos pegar todas as informações necessárias da api do FB e realizar a requisição ao nosso servidor com sucesso, porém quando **aplicativo do Facebook não está instalado** e tentamos navegar para o próximo container recebemos o seguinte erro:

`Can only update a mounted or mounting component. This usually means you called setState, replaceState, or forceUpdate on an unmounted component. This is a no-op.
Please check the code for the NavigationContainer component.`

**O fluxo esperado** é, LoadingContainer -> StartContainer -> FacebookLogin -> LoadingContainer -> StartContainer -> MainContainer. Note que ao voltar do link com o Facebook, o app **reinicia sua navegação na LoadingContainer.**

A minha **primeira hipótese** da causa, foi testar se as requisições feitas internamente ao container, afetavam algo ao controle de estado da operação, assim, refatorei o uso de Redux para o padrão adotado pela comunidade. Além de adicionar o midleware, ReduxThunk, para tratar as requisições. **A hipótese se provou falha**

A **segunda hipótese** de causa, foi em relação à estrutura de navegação do app. Antes da refatoração, todos os container faziam parte de um navigator. Agora temos o **RootNavigator**, tem um container chamado **LoadingContainer**, o qual faz a verificação se o usuário está logado ou não, e redirenciona para o navigator correspondente, **Main** ou **Start**. **A hipótese se provou falha**


###Solução provisória###
Na primeira vez que o usuário tentar logar com o facebook, realizamos o procedimento normal, e o erro ao navegar para a próxima tela irá ocorrer e é mostrado o seguinte alerta.
` 
Alert.alert(
    'Erro',
    'Ocorreu um erro ao tentar conexão com o Facebook. Tente novamente.',
    [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false }
);
`

Como na primeira tentativa, ja realizamos a requisição com nosso e guardamos na Store, no StartContainer, ele irá verificar que ja temos os dados do usuário, e irá realizar a navegação pro **Main**

