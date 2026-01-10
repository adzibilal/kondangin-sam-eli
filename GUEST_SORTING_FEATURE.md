# Guest Table Sorting Feature

## 📋 Overview
Added sortable columns to the Guests table with default alphabetical sorting (A-Z).

## ✨ Features

### 1. **Sortable Columns**
Users can click on column headers to sort the table:

- **Name** - Alphabetical (A-Z / Z-A)
- **Session** - Numerical (1-2 / 2-1)
- **Total Guests** - Numerical (Low-High / High-Low)

### 2. **Visual Indicators**
Each sortable column shows an icon:
- `↕️` - Column is sortable (not currently sorted)
- `↑` - Sorted ascending (A-Z, 1-9, Low-High)
- `↓` - Sorted descending (Z-A, 9-1, High-Low)

### 3. **Default Sorting**
- **Default field:** Name
- **Default order:** Ascending (A-Z)
- Data is automatically sorted alphabetically when page loads

### 4. **Interactive Behavior**
- **First click:** Sort ascending
- **Second click:** Toggle to descending
- **Click different column:** Switch to that column, ascending

### 5. **Sort Info Display**
Below the filters, users can see:
```
Sorted by: Name (A-Z)
```
Updates in real-time as sorting changes.

## 🎨 UI Elements

### Column Headers
```tsx
<button onClick={() => handleSort('name')}>
  Name
  <SortIcon field="name" />
</button>
```

**Styling:**
- Clickable buttons in table headers
- Hover effect: `hover:text-gray-900`
- Active sort column: icon changes color
- Smooth transitions

### Sort Icons
- **Neutral:** Gray `ArrowUpDown` icon
- **Active Ascending:** Dark `ArrowUp` icon
- **Active Descending:** Dark `ArrowDown` icon

## 🔧 Technical Implementation

### State Management
```tsx
const [sortBy, setSortBy] = useState<'name' | 'session' | 'totalGuest'>('name')
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
```

### Sort Logic
```tsx
filtered.sort((a, b) => {
  let compareA, compareB
  
  switch (sortBy) {
    case 'name':
      compareA = a.name.toLowerCase()
      compareB = b.name.toLowerCase()
      break
    case 'session':
      compareA = a.session
      compareB = b.session
      break
    case 'totalGuest':
      compareA = a.totalGuest
      compareB = b.totalGuest
      break
  }
  
  if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1
  if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1
  return 0
})
```

### Icons
- `ArrowUpDown` - Neutral state (lucide-react)
- `ArrowUp` - Ascending state
- `ArrowDown` - Descending state

## 📊 Sort Examples

### By Name (Default)
```
Ascending (A-Z):
- Alice Brown
- Bob Wilson
- Jane Smith
- John Doe

Descending (Z-A):
- John Doe
- Jane Smith
- Bob Wilson
- Alice Brown
```

### By Session
```
Ascending (1-2):
- Session 1 guests
- Session 2 guests

Descending (2-1):
- Session 2 guests
- Session 1 guests
```

### By Total Guests
```
Ascending (Low-High):
- 1 guest
- 2 guests
- 3 guests

Descending (High-Low):
- 3 guests
- 2 guests
- 1 guest
```

## 🎯 User Experience

### First Load
1. Page loads
2. Guests automatically sorted A-Z by name
3. Sort indicator shows: "Sorted by: Name (A-Z)"

### Sorting Workflow
1. User clicks "Session" column header
2. Table re-sorts by session (ascending)
3. Arrow up icon appears on Session column
4. Sort indicator updates: "Sorted by: Session (A-Z)"
5. User clicks "Session" again
6. Order reverses to descending
7. Arrow down icon appears
8. Sort indicator updates: "Sorted by: Session (Z-A)"

### Combined with Filters
- Sorting works **after** filtering
- Search results are sorted
- Session filter results are sorted
- All operations maintain current sort order

## 📁 Files Modified

1. **`/app/admin/guests/page.tsx`**
   - Added `sortBy` and `sortOrder` state
   - Created `handleSort()` function
   - Created `SortIcon` component
   - Updated `filterGuests()` to include sorting
   - Made column headers clickable
   - Added sort info display

## ✅ Features Breakdown

| Feature | Status |
|---------|--------|
| Default sort by name A-Z | ✅ |
| Click to sort | ✅ |
| Toggle asc/desc | ✅ |
| Visual indicators | ✅ |
| Sort by Name | ✅ |
| Sort by Session | ✅ |
| Sort by Total Guests | ✅ |
| Case-insensitive name sort | ✅ |
| Works with search | ✅ |
| Works with filters | ✅ |
| Sort info display | ✅ |

## 🔄 Sort Flow

```
Page Load
  ↓
Default: Sort by Name (A-Z)
  ↓
User clicks "Session"
  ↓
Sort by Session (Ascending)
  ↓
User clicks "Session" again
  ↓
Sort by Session (Descending)
  ↓
User clicks "Total Guests"
  ↓
Sort by Total Guests (Ascending)
  ↓
...and so on
```

## 🎨 Visual Hierarchy

**Inactive Column:**
```
Name ↕️
```

**Active Ascending:**
```
Name ↑ (darker icon)
```

**Active Descending:**
```
Name ↓ (darker icon)
```

## 💡 Usage Tips

1. **Quick A-Z Sort:** Click Name column header
2. **Find Session 1/2:** Click Session header
3. **Find VIP guests:** Click Total Guests to sort by count
4. **Reverse order:** Click the same column header again
5. **Multiple operations:** Sorting persists while searching/filtering

## 🚀 Benefits

1. **Better Organization** - Find guests easily
2. **Efficient Management** - Quick sorting by any criteria
3. **User-Friendly** - Intuitive click-to-sort interface
4. **Visual Feedback** - Clear indicators of current sort
5. **Consistent UX** - Follows standard table sorting patterns

---

**Result:** Guests table now supports flexible sorting with default A-Z alphabetical order! 🎉
