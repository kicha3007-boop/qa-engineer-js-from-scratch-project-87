# Вычислитель отличий (QA JS)

[![hexlet-check](https://github.com/kicha3007-boop/qa-engineer-js-from-scratch-project-87/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/kicha3007-boop/qa-engineer-js-from-scratch-project-87/actions)
[![CI](https://github.com/kicha3007-boop/qa-engineer-js-from-scratch-project-87/actions/workflows/main.yml/badge.svg)](https://github.com/kicha3007-boop/qa-engineer-js-from-scratch-project-87/actions/workflows/main.yml)

`gendiff` — консольная утилита и библиотека, которая сравнивает два плоских конфигурационных файла
(пары ключ-значение) в форматах JSON или YAML и показывает разницу между ними. Форматы вывода:
`stylish` (по умолчанию), `plain` и `json`.

Учебный проект Хекслета: https://ru.hexlet.io/programs/qa-engineer-js-from-scratch
Как это должно работать: https://asciinema.org/a/Pe6QypnLEmFWssNAjCOJN1iii

## Стек

- JavaScript (Node.js, ES-модули)
- [commander.js](https://github.com/tj/commander.js/) — разбор аргументов командной строки
- [js-yaml](https://github.com/nodeca/js-yaml) — парсинг YAML, [lodash](https://lodash.com/)
- [Vitest](https://vitest.dev/) — тесты и покрытие, [oxlint](https://oxc.rs/) и oxfmt — линтер и форматирование

## Требования

- Node.js 22 или новее
- npm, make

## Установка

```bash
git clone https://github.com/kicha3007-boop/qa-engineer-js-from-scratch-project-87.git
cd qa-engineer-js-from-scratch-project-87
make install
npm link   # делает команду gendiff доступной глобально
```

Без `npm link` утилиту можно запускать как `node bin/gendiff.js ...`. Пакет в npm не публикуется.

## Использование

```bash
gendiff -h

Usage: gendiff [options] <filepath1> <filepath2>

Compares two configuration files and shows a difference.

Options:
  -V, --version        output the version number
  -f, --format <type>  output format (default: "stylish")
  -h, --help           display help for command
```

Формат входных данных определяется по расширению файла: `.json`, `.yml`, `.yaml`. Пути можно
передавать относительные и абсолютные, форматы входных файлов можно смешивать.

### stylish (по умолчанию)

```bash
gendiff __fixtures__/file1.json __fixtures__/file2.json

{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}
```

### plain

```bash
gendiff --format plain __fixtures__/file1.yml __fixtures__/file2.yml

Property 'follow' was removed
Property 'proxy' was removed
Property 'timeout' was updated. From 50 to 20
Property 'verbose' was added with value: true
```

Строки выводятся в одинарных кавычках, числа, `true`, `false` и `null` — как есть.

### json

```bash
gendiff -f json __fixtures__/file1.json __fixtures__/file2.yml

[
  {
    "key": "follow",
    "type": "removed",
    "value": false
  },
  ...
  {
    "key": "timeout",
    "type": "changed",
    "value1": 50,
    "value2": 20
  },
  ...
]
```

Это сериализация внутреннего представления: на каждый ключ — запись с `key` и `type`
(`added`, `removed`, `changed`, `unchanged`), значение лежит в `value`, у изменённых — в `value1`
(первый файл) и `value2` (второй файл).

### Как библиотека

```javascript
import genDiff from '@hexlet/code';

const diff = genDiff('path/to/file1.json', 'path/to/file2.yml', 'plain');
console.log(diff);
```

Третий параметр — имя формата, по умолчанию `stylish`. При ошибке (нет файла, неизвестное
расширение, битые данные, неизвестный формат вывода) функция бросает исключение, а утилита печатает
сообщение и завершается с кодом 1.

## Тесты и проверки

```bash
make test            # все тесты (vitest run)
make test-coverage   # тесты с покрытием; сборка падает, если покрытие ниже 90%
make lint            # oxlint + проверка форматирования oxfmt
make lint-fix        # автоисправление форматирования и линтера
```

Тесты лежат в `__tests__/genDiff.test.js` и проверяют только публичную функцию `genDiff`.
Входные данные и ожидаемый вывод — в фикстурах `__fixtures__/` (JSON и YAML). Сценарии
параметризованы: каждая пара входных файлов прогоняется через все три формата вывода; отдельно
проверены формат по умолчанию, одинаковые файлы, относительные пути и ошибки — отсутствующий файл,
неподдерживаемое расширение, битые JSON и YAML, неизвестный формат вывода.

В GitHub Actions (`.github/workflows/main.yml`) на каждый push запускаются `make lint` и
`make test-coverage`.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
