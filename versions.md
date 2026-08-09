# Versionado npm

Formato:

```text
MAJOR.MINOR.PATCH
```

## PATCH

Para fixes o cambios que no agregan funcionalidad nueva ni rompen compatibilidad.

```bash
npm version patch --no-git-tag-version
```

Ejemplo:

```text
1.2.3 → 1.2.4
```

## MINOR

Para nueva funcionalidad compatible con versiones anteriores.

```bash
npm version minor --no-git-tag-version
```

Ejemplo:

```text
1.2.3 → 1.3.0
```

## MAJOR

Para cambios que rompen compatibilidad.

```bash
npm version major --no-git-tag-version
```

Ejemplo:

```text
1.2.3 → 2.0.0
```

## Regla rápida

```text
Bug fix                → PATCH
Nueva funcionalidad    → MINOR
Breaking change        → MAJOR
```

## Flujo

```bash
npm test
npm run build

npm version patch --no-git-tag-version
# o minor / major

git add package.json package-lock.json
git commit -m "chore: bump version"
git push
```

Después:

```text
PR → merge a main → GitHub Actions → npm publish
```
