# Semantic Versioning Rules For Project
`<major>.<minor>.<revision>-<b|rc><increment>`

## Major x.0 versions should be bare or release candidates.
### Valid
- 1.0.0
- 1.0.1
- 2.0.0-rc0
- 2.0.2-rc1
### Invalid
- 1.0.0-b0

## Non-Zero minor versions are for unreleased feature development.
### Valid
- 1.1.0-b0
### Invalid
- 1.2.0
- 1.3.0-rc0

## Revisions are for bug fixes on Major releases only.
### Valid
- 1.0.1
- 1.0.1-rc0
### Invalid
- 1.0.1-b0

## All initial unreleased work going under 0.1.0
### Valid
- 0.1.0-b0
- 0.1.0-b1
- 0.1.0-b2
### Invalid
- 0.0.0-b0
- 0.1.0
- 0.2.0-b0

## Example Development Flow
```
0.1.0-b0        - Initial Develeopment
    0.1.0-b1    - More Work
    0.1.0-b2    - More Work
    0.1.0-b3    - More Work
    ...
1.0.0-rc0       - Release 1.0 Candidate
    1.0.0-rc1   - Adjusting Candidate
    ...
1.0.0           - Release 1.0
1.0.1-rc0       - Bug Fix for 1.0
    1.0.1-rc1   - Adjusting bug fix
    1.0.1-rc2   - Adjusting bug fix
    ...
1.0.1           - Release 1.0.1
1.0.2-rc0       - Bug Fix for 1.0.1
    1.0.2-rc1   - Adjusting bug fix
    ...
1.0.2           - Release 1.0.2
1.1.0-b0        - New Feature Develeopment
    1.1.0-b1    - More Work
    1.1.0-b2    - More Work
    ...
1.2.0-b0        - New Feature Develeopment
    1.2.0-b1    - More Work
    ...
2.0.0-rc0       - Release 2.0 Candidate
    2.0.0-rc1   - Adjusting Candidate
    2.0.0-rc2   - Adjusting Candidate
    ...
2.0.0           - Release 2.0
```