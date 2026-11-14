import { Settings2, Store, Users, Bell, ShieldCheck } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

        <p className="mt-1 text-sm text-text-secondary">
          Manage your ShopKB settings and preferences.
        </p>
      </div>

      <section className="flex min-h-105 flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Settings2 size={32} className="text-primary" />
        </div>

        <span className="mb-3 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          COMING SOON
        </span>

        <h2 className="text-xl font-bold text-text-primary">
          Something better is on the way
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
          We're working on bringing more control and flexibility to your ShopKB
          experience. Soon, you'll be able to manage your business preferences,
          accounts, and other settings from one place.
        </p>

        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              icon: Store,
              title: "Business Preferences",
              description: "Customize how your shop operates.",
            },
            {
              icon: Users,
              title: "Account Management",
              description: "Manage accounts and user preferences.",
            },
            {
              icon: Bell,
              title: "Notifications",
              description: "Control how you receive updates.",
            },
            {
              icon: ShieldCheck,
              title: "Security",
              description: "Manage security and access preferences.",
            },
          ].map((item) => {
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
          Thank you for growing with ShopKB.
        </p>
      </section>
    </div>
  );
}
