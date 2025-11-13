# PropNexus Off-Market Deals Module

A comprehensive off-market property deal management system for property investors and agents to track, score, and manage off-market property opportunities.

**Experience Qualities**:
1. **Professional** - The interface should inspire confidence with clean data presentation and sophisticated scoring visualizations
2. **Efficient** - Users should be able to quickly filter, import, and export deals with minimal friction
3. **Insightful** - Investment scoring and financial metrics should be immediately clear and actionable

**Complexity Level**: Light Application (multiple features with basic state)
  - Includes data import, filtering, scoring calculations, and multiple view types with persistent state management

## Essential Features

### Off-Market Deal Listing
- **Functionality**: Display all off-market property deals in card or table format with key metrics visible
- **Purpose**: Allows users to quickly scan available opportunities and identify promising deals
- **Trigger**: User navigates to off-market deals page
- **Progression**: Load deals from storage → Apply active filters → Render in selected view mode → User clicks deal for details
- **Success criteria**: All deals display with accurate pricing, discount %, and investment scores; view toggles work smoothly

### Investment Score Calculation
- **Functionality**: Automatically calculate 0-100 investment score based on discount, refurb costs, and rental potential
- **Purpose**: Provides objective comparison metric across different properties
- **Trigger**: Score computed when deal is imported or viewed
- **Progression**: Load deal data → Calculate price score (discount from value) → Apply refurb penalty → Add rental boost → Display score with visual indicator
- **Success criteria**: Score accurately reflects deal quality; visual representation (badge/progress) is clear

### Advanced Filtering
- **Functionality**: Filter deals by postcode, price range, discount percentage, and minimum score
- **Purpose**: Helps users narrow down to deals matching their investment criteria
- **Trigger**: User adjusts filter controls
- **Progression**: User sets filter criteria → Apply filters to deal list → Update displayed results → Persist filter state
- **Success criteria**: Filters work individually and in combination; results update instantly; filters persist across sessions

### CSV Import
- **Functionality**: Upload CSV file containing property leads and parse into deal records
- **Purpose**: Enables bulk import of leads from various sources (agents, scrapers, etc.)
- **Trigger**: User clicks Import button and selects CSV file
- **Progression**: Select file → Parse CSV client-side → Validate fields → Save to storage → Display success/error counts → Redirect to listings
- **Success criteria**: CSV with required fields imports successfully; errors are reported clearly; duplicate detection optional

### Deal Detail View
- **Functionality**: Show comprehensive property information with financial calculations and action buttons
- **Purpose**: Provides full context for decision-making on individual deals
- **Trigger**: User clicks "View Details" on a deal card
- **Progression**: Navigate to detail page → Load deal data → Display all fields → Show score breakdown → Offer export/share options
- **Success criteria**: All deal information displays correctly; financial metrics are accurate; action buttons are functional

### CRM Export
- **Functionality**: Export deal data in JSON format suitable for CRM import
- **Purpose**: Allows users to move qualified leads into their CRM system
- **Trigger**: User clicks "Export to CRM" button on deal detail page
- **Progression**: Click export → Format deal data as JSON → Trigger download → Show success notification
- **Success criteria**: JSON file downloads with complete deal information in structured format

### PDF Deal Pack Generation
- **Functionality**: Generate downloadable PDF with property details and investment analysis
- **Purpose**: Creates shareable deal packs for partners, investors, or records
- **Trigger**: User clicks "Download Deal Pack" button
- **Progression**: Click download → Format deal information → Generate PDF → Trigger download
- **Success criteria**: PDF contains all key deal information in professional format

## Edge Case Handling

- **Empty State** - Show helpful message with import button when no deals exist
- **Missing Data** - Display placeholder or "Not specified" for optional fields; handle missing images gracefully
- **Invalid CSV** - Show clear error messages for malformed files with line numbers and field issues
- **Filter No Results** - Display "No deals match your criteria" with option to clear filters
- **Duplicate Deals** - Allow duplicates but show warning if address/postcode matches existing record
- **Invalid Calculations** - Handle missing price/value data by showing "Score unavailable" rather than crashing

## Design Direction

The design should feel professional and data-dense like a financial dashboard, balanced with modern property listing aesthetics. Clean data tables mixed with visual property cards, with investment metrics displayed prominently. The interface should feel efficient and trustworthy - less playful, more business tool.

## Color Selection

Complementary (opposite colors) - Professional blue-green for trust and financial stability, with warm orange accents for deals/opportunities and alerts.

- **Primary Color**: Deep teal `oklch(0.45 0.12 200)` - communicates professionalism, trust, and financial sophistication
- **Secondary Colors**: Slate gray `oklch(0.55 0.02 240)` for supporting UI elements and neutral backgrounds
- **Accent Color**: Warm orange `oklch(0.68 0.18 45)` for highlighting good deals, CTAs, and score indicators
- **Foreground/Background Pairings**:
  - Background (White `oklch(0.99 0 0)`): Dark text `oklch(0.2 0.01 240)` - Ratio 12.8:1 ✓
  - Card (Light gray `oklch(0.97 0.005 240)`): Dark text `oklch(0.2 0.01 240)` - Ratio 12.1:1 ✓
  - Primary (Deep teal `oklch(0.45 0.12 200)`): White text `oklch(0.99 0 0)` - Ratio 8.2:1 ✓
  - Secondary (Slate `oklch(0.55 0.02 240)`): White text `oklch(0.99 0 0)` - Ratio 4.9:1 ✓
  - Accent (Warm orange `oklch(0.68 0.18 45)`): Dark text `oklch(0.2 0.01 240)` - Ratio 7.1:1 ✓
  - Muted (Light slate `oklch(0.92 0.01 240)`): Muted text `oklch(0.5 0.015 240)` - Ratio 4.7:1 ✓

## Font Selection

Typography should convey professionalism and clarity with excellent readability for dense financial data, using a modern sans-serif that works well for both headings and tabular data.

- **Primary Font**: Inter - Clean, professional, excellent for numbers and data tables
- **Typographic Hierarchy**:
  - H1 (Page Title): Inter SemiBold/32px/tight (-0.02em) - "Off-Market Deals"
  - H2 (Section Headers): Inter SemiBold/24px/tight (-0.01em) - Deal detail sections
  - H3 (Card Titles): Inter Medium/18px/normal - Property titles
  - Body (Descriptions): Inter Regular/14px/relaxed (1.5) - General text
  - Caption (Metadata): Inter Regular/12px/normal - Timestamps, counts
  - Numbers (Prices/Scores): Inter SemiBold/16px/tight - Financial figures
  - Labels (Form fields): Inter Medium/13px/normal - Input labels

## Animations

Animations should be subtle and purposeful, reinforcing data updates and state changes without slowing down the workflow-focused nature of the application.

- **Purposeful Meaning**: Quick, businesslike transitions that confirm actions without feeling playful - data-driven rather than decorative
- **Hierarchy of Movement**: Score badges and price changes deserve subtle emphasis; view mode switches should be smooth; filter results should update with minimal motion

## Component Selection

- **Components**: 
  - Card for deal listings with hover states
  - Button for all actions (primary for CTA, secondary for filters)
  - Input for text filters (postcode search)
  - Select for dropdown filters (sort options)
  - Slider for price range and discount % filters
  - Badge for scores, status indicators, and discount %
  - Table for tabular view of deals
  - Dialog for import workflow
  - Tabs for view mode switching (cards/table)
  - Separator for section divisions
  - Progress for score visualization
  - Tooltip for explaining score components
  
- **Customizations**: 
  - Custom OffMarketCard with financial metrics layout
  - Custom ScoreBadge with color-coded ranges (0-40 red, 41-70 orange, 71+ green)
  - Custom FilterPanel with collapsible sections
  
- **States**: 
  - Buttons: Distinct hover with slight lift, active pressed state, disabled grayed out
  - Cards: Subtle shadow elevation on hover, border highlight on active filter match
  - Inputs: Blue focus ring matching primary color, error state with red border
  
- **Icon Selection**: 
  - FunnelSimple for filters
  - UploadSimple for import
  - DownloadSimple for export
  - FilePdf for PDF generation
  - ListBullets / SquaresFour for view toggles
  - Star / TrendUp for scoring indicators
  - MapPin for location/postcode
  
- **Spacing**: 
  - Card padding: p-6
  - Section gaps: gap-8
  - Element spacing: gap-4
  - Form fields: gap-3
  - Button groups: gap-2
  
- **Mobile**: 
  - Stack filter panel above results on mobile
  - Switch to single column card layout below 768px
  - Table view switches to stacked cards on mobile
  - Full-width action buttons on mobile
  - Collapsible filter panel with floating toggle button
