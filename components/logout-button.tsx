"use client";

import { useActionState } from "react";
import { logout } from "@/app/actions/logout";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
    const [error, action, pending] = useActionState(logout, undefined);

    return (
        <form action={action}>
            <Button type="submit" variant="outline" disabled={pending}>
                {pending ? "Logging out…" : "Log out"}
            </Button>
            {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
        </form>
    );
}
