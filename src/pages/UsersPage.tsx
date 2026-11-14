import { Users, UserRound, ShieldCheck, UserCog, KeyRound } from "lucide-react";

export function UsersPage() {
  const features = [
    {
      icon: UserRound,
      title: "User Accounts",
      description: "View and manage staff accounts.",
    },
    {
      icon: ShieldCheck,
      title: "Roles & Permissions",
      description: "Control what each user can access.",
    },
    {
      icon: UserCog,
      title: "Account Management",
      description: "Manage user details and account status.",
    },
    {
      icon: KeyRound,
      title: "Access Control",
      description: "Manage account access and security.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>

        <p className="mt-1 text-sm text-text-secondary">
          Manage users and their access to ShopKB.
        </p>
      </div>

      <section className="flex min-h-105 flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Users size={32} className="text-primary" />
        </div>

        <span className="mb-3 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          COMING SOON
        </span>

        <h2 className="text-xl font-bold text-text-primary">
          User Management is on the way
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
          We're working on making it easier to manage your shop's team. Soon,
          you'll be able to manage staff accounts, assign roles, control
          permissions, and monitor account access from one place.
        </p>

        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface">
                  <Icon size={19} className="text-text-secondary" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-text-secondary">
          Better team management, coming soon.
        </p>
      </section>
    </div>
  );
}
