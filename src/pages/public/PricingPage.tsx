import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [annualBilling, setAnnualBilling] = useState(true);

  const plans = [
    {
      name: 'Free / Student',
      badge: 'College & Individual',
      price: '$0',
      period: 'forever',
      description: 'Ideal for college project teams, final-year project squads, and individual builders.',
      features: [
        'Up to 3 active workspaces',
        'Unlimited projects and tasks',
        'Drag-and-drop Kanban boards',
        'GitHub repository linking',
        '1 Public Showcase project',
        'Community support',
      ],
      cta: 'Start Free',
      variant: 'outline' as const,
      popular: false,
    },
    {
      name: 'Pro / Freelancer',
      badge: 'Most Popular',
      price: annualBilling ? '$16' : '$20',
      period: 'per month',
      description: 'For professional freelancers and agile development teams shipping production client work.',
      features: [
        'Unlimited multi-tenant workspaces',
        'Unlimited team members & invitations',
        'Full GitHub & Vercel deployment tracking',
        'Milestone deadline & workload analytics',
        'Unlimited Public Showcases with custom domain',
        'Activity timeline audit logs',
        'Priority technical support',
      ],
      cta: 'Get Started with Pro',
      variant: 'primary' as const,
      popular: true,
    },
    {
      name: 'Agency & Studio',
      badge: 'For Growing Teams',
      price: annualBilling ? '$48' : '$60',
      period: 'per month',
      description: 'Advanced workspace management, client portal views, and custom deployment webhooks for agencies.',
      features: [
        'Everything in Pro, plus:',
        'Unlimited client workspaces with separate billing',
        'Custom branding & white-label showcase',
        'Dedicated webhook endpoint routing',
        'Role-based granular ACL policies',
        'Exportable audit & compliance logs',
        'Dedicated account manager',
      ],
      cta: 'Contact Agency Sales',
      variant: 'outline' as const,
      popular: false,
    },
  ];

  return (
    <div className="space-y-16 py-12 md:py-20 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <Badge variant="primary" size="md">Flexible SaaS Pricing</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Simple, transparent pricing for every scale
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          From college project assignments to high-velocity digital agency delivery teams.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs ${!annualBilling ? 'text-white font-semibold' : 'text-slate-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnualBilling((prev) => !prev)}
            className="relative h-6 w-11 rounded-full bg-slate-800 border border-slate-700 transition-colors focus:outline-none"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-indigo-500 transition-transform ${
                annualBilling ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-xs ${annualBilling ? 'text-white font-semibold' : 'text-slate-400'}`}>
            Annual <span className="text-emerald-400 font-medium">(Save 20%)</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={`relative p-8 flex flex-col justify-between ${
              p.popular
                ? 'border-indigo-500/50 bg-gradient-to-b from-indigo-950/40 to-slate-900 shadow-glow'
                : ''
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="primary" size="sm" className="bg-indigo-600 text-white border-indigo-400">
                  {p.badge}
                </Badge>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{p.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white tracking-tight">{p.price}</span>
                <span className="text-xs text-slate-400">/{p.period}</span>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Features included:</p>
                <ul className="space-y-2.5">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant={p.variant}
                className="w-full"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {p.cta}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 text-xs text-slate-500 space-y-2">
        <p>All plans include PostgreSQL multi-tenant isolation, SSL encrypted communication, and zero code leaks.</p>
        <p>College students: Verify with your .edu email for extended Pro trial access.</p>
      </div>
    </div>
  );
};
