import { CompanyInfo } from '../types';

/**
 * Calculates the dynamic completed projects count.
 * By default:
 * - Starts from the baseline (default: 12)
 * - Automatically increments as projects are added to the portfolio (above the initial 6 sample projects)
 * - Or directly matches portfolio count if mode is 'portfolio_exact'
 * - Or fixed custom count if mode is 'custom_fixed'
 */
export function calculateCompletedProjectsCount(
  projectsCount: number,
  companyInfo?: Partial<CompanyInfo>
): string {
  const mode = companyInfo?.completedProjectsMode || 'base_plus_added';
  const customBase = companyInfo?.completedProjectsBase?.trim() || '12';
  const hasPlus = customBase.includes('+');

  if (mode === 'portfolio_exact') {
    return `${projectsCount}`;
  }

  const baseNum = parseInt(customBase.replace(/[^0-9]/g, ''), 10);
  const validBase = isNaN(baseNum) ? 12 : baseNum;

  if (mode === 'custom_fixed') {
    return hasPlus ? `${validBase}+` : `${validBase}`;
  }

  // mode === 'base_plus_added' (default)
  // Baseline 12 + any newly added projects beyond the initial 6 showcase projects
  const initialShowcaseCount = 6;
  const addedProjects = Math.max(0, projectsCount - initialShowcaseCount);
  const total = validBase + addedProjects;

  return hasPlus ? `${total}+` : `${total}`;
}
