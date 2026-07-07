# Implementação: Sair da Organização

## Alterações Necessárias em `src/app/(dashboard)/mainCenter/page.tsx`

### 1. Adicionar Importação do Componente (linha ~38)

```typescript
import { LeaveOrganizationDialog } from "@/components/layout/leaveOrganizationDialog";
```

### 2. Adicionar Estados Adicionais (após linha ~410, onde estão outros estados)

```typescript
const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
const [leavingOrganization, setLeavingOrganization] = useState(false);
```

### 3. Adicionar Função handleLeaveOrganization (após a função handleRemoveFriend, ~linha 1186)

```typescript
const handleLeaveOrganization = useCallback(async () => {
	if (!organization || leavingOrganization) return;

	setLeavingOrganization(true);

	try {
		await api.delete(
			`/organizations/${organization.organizationId}/memberships/leave`,
		);

		setToast({
			title: "Você saiu da organização com sucesso.",
			description: "Será redirecionado em breve...",
			variant: "success",
		});

		// Redirect to mainDash after a short delay
		setTimeout(() => {
			router.push(addLocaleToPathname("/mainDash", locale));
		}, 1500);
	} catch (err) {
		setLeavingOrganization(false);
		const message = err instanceof Error ? err.message : "Não foi possível sair da organização.";
		setToast({
			title: "Erro ao sair",
			description: message,
			variant: "error",
		});
	}
}, [organization, leavingOrganization, router, locale]);
```

### 4. Adicionar Botão "Sair" na Header (após linha ~1200, no return/render section)

Substitua:
```typescript
<div className="flex items-center gap-3">
	<Link
		href={backHref}
		className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#002045] shadow-sm transition-colors hover:border-[#1E3A8A]/30 hover:text-[#1E3A8A]"
	>
		<ChevronLeft size={16} />
		Voltar
	</Link>
</div>
```

Por:
```typescript
<div className="flex items-center gap-2">
	<LeaveOrganizationDialog
		organizationName={organization.name}
		isAdmin={canManageEvents}
		onConfirm={handleLeaveOrganization}
	/>
	<Link
		href={backHref}
		className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#002045] shadow-sm transition-colors hover:border-[#1E3A8A]/30 hover:text-[#1E3A8A]"
	>
		<ChevronLeft size={16} />
		Voltar
	</Link>
</div>
```

## Endpoints Necessários

O backend deve fornecer (baseado no seu controlador):

- **DELETE** `/organizations/{organizationId}/memberships/leave` - Utilizador sai da organização
- **DELETE** `/organizations/{organizationId}/memberships/{memberId}` - Admin remove um membro (já existe)

## Funcionalidades

✅ **Qualquer membro**: Pode sair da organização clicando em "Sair da Igreja" na header
✅ **Admin aviso**: Aviso especial avisando que é admin quando tenta sair
✅ **Redirecionamento**: Após sair com sucesso, redireciona para mainDash
✅ **Tratamento de erros**: Se falhar, mostra mensagem de erro
✅ **Modal confirmação**: Pede confirmação antes de sair

## Próximos Passos (Opcional)

- Adicionar funcionalidade de remover membros da UI se o utilizador for admin
- Criar endpoint para listar membros com opção de remover (para admin)
