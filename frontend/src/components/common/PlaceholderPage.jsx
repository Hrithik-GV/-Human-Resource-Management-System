import React from 'react';
import { Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { PageContainer } from './PageContainer';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const PlaceholderPage = ({
  title,
  description,
  phase = 'Phase 2',
}) => {
  return (
    <PageContainer title={title} description={description}>
      <Card className="border-dashed border-2 border-indigo-200 bg-white">
        <CardContent className="flex flex-col items-center justify-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>

          <Badge variant="primary" size="md" className="mb-3">
            <Clock className="w-3.5 h-3.5 mr-1" /> Scheduled for {phase}
          </Badge>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {title} Module Under Development
          </h2>

          <p className="text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
            {description || 'This section is part of the upcoming phase implementation. The complete workflow, data tables, and forms will be integrated soon.'}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Phase 1 Foundation Ready — Architecture active</span>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
