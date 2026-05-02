# Documentação do Projeto

## Uso de Enums no Back-end (C# .NET)

Neste projeto, utilizamos enums para representar valores fixos e controlados, como nível de dificuldade e tipo de atividade.

### Exemplo

```csharp
public enum Level
{
    Beginner = 1,
    Intermediate = 2,
    Advanced = 3
}
```

Esses enums são utilizados nas entidades, por exemplo:

```csharp
public Level Level { get; set; }
```

---

### Vantagens do uso de Enum

* Evita inconsistência de dados (ex: "iniciante", "Iniciante", "beginner")
* Facilita validação
* Melhora a legibilidade do código
* Garante que apenas valores válidos sejam utilizados
* Melhor performance no banco (armazenado como inteiro)

---

### Relação com o padrão MVC

Dentro da arquitetura MVC, os enums fazem parte da camada Model, garantindo integridade e padronização dos dados que trafegam entre Controller e View (ou API).

---

## Uso de Sass no Front-end

O projeto utiliza Sass (SCSS) como pré-processador de CSS para melhorar a organização e reutilização dos estilos.

---

### O que é Sass?

Sass é uma extensão do CSS que permite:

* Uso de variáveis
* Reutilização de código
* Melhor organização dos arquivos de estilo

---

### Exemplo com variáveis

```scss
$primary-color: #facc15;

.button {
  background: $primary-color;
}

.card {
  background: $primary-color;
}
```

---

### Benefícios no projeto

* Centralização de cores e estilos
* Facilidade de manutenção
* Redução de repetição de código
* Melhor organização dos arquivos

---

### Estrutura recomendada

```bash
styles/
  _variables.scss
  _layout.scss
  _components.scss
```

---

## Conclusão

* Enums foram utilizados para garantir consistência e segurança nos dados do back-end.
* Sass foi adotado para tornar o front-end mais organizado, reutilizável e escalável.
