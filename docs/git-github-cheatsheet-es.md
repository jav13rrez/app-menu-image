# Chuleta Git + GitHub (local) para tener siempre a mano

Guía práctica para trabajar en local y sincronizar con GitHub sin perderte.

---

## 1) Flujo típico de trabajo

```bash
# Ir al proyecto local
cd D:\app-menu-image

# Ver estado rápido (rama, archivos modificados)
git status

# Ir a main y actualizarlo desde GitHub
git switch main
git pull origin main

# Crear rama nueva para una tarea
# utilidad: aislar cambios y evitar romper main
git switch -c feature/nombre-corto

# Ver qué cambiaste
# utilidad: revisar antes de guardar
git diff

# Preparar archivos para commit
# utilidad: seleccionar qué entra al historial
git add .
# o: git add ruta/archivo.md

# Crear commit
# utilidad: guardar un checkpoint claro en historial
git commit -m "docs: actualizar TSD SaaS"

# Subir rama a GitHub por primera vez
# utilidad: publicar cambios y abrir PR
git push -u origin feature/nombre-corto

# Siguientes pushes en la misma rama
git push
```

---

## 2) Abrir PR y cerrar ciclo

```bash
# (web) abrir PR desde GitHub: Compare & pull request

# Con GitHub CLI (opcional)
# utilidad: crear PR desde terminal
gh pr create --base main --head feature/nombre-corto --title "Título PR" --body "Descripción"

# Tras merge del PR:
# volver a main y traer cambios finalizados
git switch main
git pull origin main

# borrar rama local ya usada
# utilidad: mantener repo limpio
git branch -d feature/nombre-corto
```

---

## 3) Comandos esenciales con utilidad comentada

```bash
# Ver estado del repo
git status              # utilidad: qué archivos están staged / unstaged / untracked

# Ver historial compacto
git log --oneline -10   # utilidad: revisar últimos commits rápido

# Ver diferencias no commiteadas
git diff                # utilidad: revisar cambios antes de add/commit

# Listar ramas locales
git branch              # utilidad: saber dónde estás trabajando

# Listar ramas locales y remotas
git branch -a           # utilidad: ver ramas disponibles en origin

# Cambiar de rama existente
git switch main         # utilidad: moverte entre ramas sin usar checkout

# Crear y cambiar a rama nueva
git switch -c feature/x # utilidad: arrancar trabajo nuevo aislado

# Añadir todo al stage
git add .               # utilidad: preparar todos los cambios para commit

# Añadir archivo concreto
git add ruta/archivo    # utilidad: commit parcial controlado

# Commit con mensaje
git commit -m "mensaje" # utilidad: guardar cambios en historial

# Corregir último commit (mensaje o contenido)
git commit --amend      # utilidad: ajustar último commit sin crear otro

# Traer referencias remotas sin mezclar
git fetch origin        # utilidad: actualizar info de ramas remotas

# Traer y mezclar cambios remotos
git pull origin main    # utilidad: actualizar tu rama local

# Subir rama actual
git push                # utilidad: publicar commits en remoto

# Subir rama y enlazar seguimiento
git push -u origin feature/x # utilidad: simplifica pushes futuros

# Ver remotos configurados
git remote -v           # utilidad: confirmar URL de GitHub
```

---

## 4) Recuperación y "deshacer" (muy útil)

```bash
# Descartar cambios de un archivo no staged
git restore archivo.md
# utilidad: volver archivo al último commit

# Descartar todos los cambios no staged
git restore .
# utilidad: limpiar working tree (ojo: destructivo)

# Guardar cambios temporales sin commit
git stash
# utilidad: aparcar trabajo para cambiar de rama rápido

# Recuperar último stash
git stash pop
# utilidad: continuar trabajo aparcado

# Deshacer último commit pero mantener cambios preparados
git reset --soft HEAD~1
# utilidad: rehacer commit sin perder trabajo
```

---

## 5) Errores comunes y solución rápida

```bash
# Error: src refspec <rama> does not match any
# causa: esa rama no existe localmente o no tiene commit
git branch                          # comprobar ramas
git switch -c feature/nueva-rama    # crear rama
# hacer al menos un commit
git add . && git commit -m "init"
git push -u origin feature/nueva-rama

# Error: remote origin already exists
# causa: origin ya está configurado (normal)
git remote -v                       # revisar URL actual
# si está mal:
git remote set-url origin https://github.com/USUARIO/REPO.git

# Mensaje: Everything up-to-date
# significa: no hay commits nuevos para subir
git status
git log --oneline -5
```

---

## 6) Mini checklist antes de abrir PR

```bash
# 1) Estoy en mi rama de trabajo
git branch

# 2) No hay cambios pendientes sin commit
git status

# 3) Revisé qué voy a subir
git diff --staged

# 4) Subí la rama
git push

# 5) Abrí PR contra main y checks en verde
```

---

## 7) Convención recomendada de nombres

- Ramas:
  - `feature/...` nuevas funcionalidades
  - `fix/...` correcciones
  - `docs/...` documentación
- Commits:
  - `feat: ...`
  - `fix: ...`
  - `docs: ...`
  - `refactor: ...`

Ejemplo:
- Rama: `docs/saas-pricing-guide`
- Commit: `docs: add pricing credits model guide`

