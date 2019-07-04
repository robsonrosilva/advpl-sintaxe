![Version](https://vsmarketplacebadge.apphb.com/version/robsonrosilva.advpl-sintaxe.svg) ![Installs](https://vsmarketplacebadge.apphb.com/installs/robsonrosilva.advpl-sintaxe.svg) ![Rating](https://vsmarketplacebadge.apphb.com/rating-short/robsonrosilva.advpl-sintaxe.svg)

# Leia-me

## Visual Studio Code ADVPL Análise e GIT

Esta extensão adiciona no visual code [VsCode MarketPlace](https://marketplace.visualstudio.com/items?itemName=robsonrosilva.advpl-sintaxe):

- Snippets da linguagem.
- Funcionalidades para promover os desenvolvimentos utilizando git de forma a enviar para homologação e produção de forma simples, gerando TAGS ao mergear para a branch de produção.
- Análise de qualidade e sintaxe de programas ADVPL.

Caso você encontre algum problema ou queira dar alguma sugestão de melhoria, por favor abra uma issue no [GitHub](https://github.com/robsonrosilva/advpl-sintaxe/issues).

# Instalação

1. Intalação Visual Studio Code 0.10.1 ou superior
2. Iniciar o Visual Studio Code
3. Na aba de pompt de comando `Ctrl-Shift-P` (Windows, Linux) ou `Cmd-Shift-P` (OSX)
4. Selecione Extensão
5. Digite `ADVPL`
6. Escolha a extensão
7. Recarregue Visual Studio Code

# Análise de Qualidade e Sintaxe

## ITENS ANALISADOS

Verifica se estão sendo utilizados padrões básicos de qualidade como:

- EmbededSql em vez de TcQuery.
- Include TOTVS.CH.
- Includes desnecessários.
- Includes que faltam.
- Comentários desnecessários.
- Padrões de comentários.(Necessário configurar o settings)
- Comentários de todas as funções, métodos, webservices e classes.
- Critica de uso de Connout.
- Critica de conflitos de merge.
- Utilização de CHR(13) + CHR(10) em vez da variável CRLF.
- Tabelas fixas nas queries.(Necessário configurar o settings)
- Schema (banco de dados) fixo na query.(Necessário configurar o settings)

![Análise de Fontes](images/analiseFontes.png?raw=true 'Análise de Fontes')

# GIT

## BRANCHES

- **Merge para Teste** Branch de Teste é uma branch onde todas as features e hotfixes serão enviados para submeter aos primeiros testes.
- **Merge para Homologação** Branch de Homologação é uma branch onde são enviadas todas as implementações que estão testadas e aprovadas.
- **Merge para Produção** Branch de Produção é destinada a ser aplicada em ambiente de produção onde sempre se deve taguear a versão a ser aplicada.
- **Atualiza Branche** Atualiza a Branche Release e faz um merge para a branche atual.

## FLUXO

![Fluxo do GIT](images/fluxoGit.png?raw=true 'Fluxo do GIT')

# Snippets

Foram montados snippets para facilitar o desenvolvimento de funcionalidades ADVPL.

![Snippets](images/snippets.png?raw=true 'Snippets')

1. TReport

- **tReport1** - Modelo de TReport 1 Sessão.
- **tReport2** - Modelo de TReport 2 Sessões.
- **tReport3** - Modelo de TReport 3 Sessões.
- **tReport4** - Modelo de TReport 4 Sessões.
- **tReport5** - Modelo de TReport 5 Sessões.
- **tReportTrCell** - Modelo de TRCell para uso nas sessões.
- **tReportAllParam** - Modelo de adição de parâmetros de impressão.
- **pergunta** - Modelo de PutSx1 para geraçãod e parâmetros para o relatório.

2. WebServices

- **WebService** - Estrutura base do Fonte para WebServices.
- **WsMethodDec** - Estrutura de declaração de método.
- **WsMethod** - Estrutura do método.
- **WsD\_\_** - Estrutura de declaração de WsData.
- **WSStruct** - Estrutura de Array para o WsData tipo Array.

3. WebServices REST

- **WebServiceREST** - Estrutura base do Fonte para WebServices REST.
- **WsMethodGetREST** - Estrutura do método GET para WebServices REST.
- **WsMethodPostREST** - Estrutura do método POST para WebServices REST.
- **WsMethodPutREST** - Estrutura do método PUT para WebServices REST.
- **WsMethodDeleteREST** - Estrutura do método DELETE para WebServices REST.
- **WsResponseTrueREST** - Retorno positivo para a operação para WebServices REST.
- **WsResponseFalseREST** - Retorno negativo para a operação para WebServices REST.

4. Linguagem

- **WHILETB** - While para Tabela.
- **FOR** - For convencional.
- **CASE** - Case completo.
- **IF** - If convencional.
- **BEGINSQL** - Modelo de EmbededSql.

## VERSÃO ATUAL

### 1.0.1

- Implementação de GitFollowTags conforme atualização do GIT.

## Modelo de settings.json

```json
{
  "advpl-sintaxe": {
    "branchHomologacao": "release",
    "branchProducao": "master",
    "branchTeste": "validacao",
    "comentFontPad": [
      "/*//#########################################################################################",
      "Projeto\\ \\:",
      "Modulo\\ \\ \\:",
      "Fonte\\ \\ \\ \\:",
      "Objetivo\\:"
    ],
    "empresas": ["01", "02"],
    "ownerDb": ["PROTHEUS", "PROTHEUS12"],
    "validaProjeto": true
  }
}
```

## Código

[Github](https://github.com/robsonrosilva/advpl-sintaxe)

** Enjoy!**
