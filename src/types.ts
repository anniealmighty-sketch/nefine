/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProjectCategory = 'All' | 'Brochure' | 'WallGraphic' | 'Logo' | 'DetailPage';

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'All'>;
  imageUrl: string;
  innerImageUrl?: string;
  desc: string;
  concept: string;
  colors: string[];
  client: string;
  year: string;
  highlights: string[];
}
