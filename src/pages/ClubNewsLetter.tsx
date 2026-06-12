import { useEffect, useState } from 'react';
import { Search, FileText, Download, Calendar, Filter } from 'lucide-react';

interface ClubNewsletter {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  published_date: string;
  location?: string;
  description?: string;
  uploaded_by?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export default function ClubNewsLetter() {
  const [newsletters, setNewsletters] = useState<ClubNewsletter[]>([]);
  const [filteredNewsletters, setFilteredNewsletters] = useState<ClubNewsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string | 'all'>('all');

  useEffect(() => {
    loadClubNewsletters();
  }, []);

  useEffect(() => {
    filterNewsletters();
  }, [newsletters, searchQuery, selectedYear, selectedMonth]);

  const loadClubNewsletters = async () => {
  try {
    setLoading(true);

    const response = await fetch(`${API_BASE_URL}/newsletters`);

    if (!response.ok) {
      throw new Error('Failed to fetch newsletters');
    }

    const result = await response.json();

    setNewsletters(
      Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : []
    );
  } catch (error) {
    console.error('Error loading newsletters:', error);
    setNewsletters([]);
  } finally {
    setLoading(false);
  }
};

  const filterNewsletters = () => {
    let filtered = newsletters;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(newsletter =>
        newsletter.title.toLowerCase().includes(query) ||
        newsletter.description?.toLowerCase().includes(query) ||
        newsletter.location?.toLowerCase().includes(query) ||
        getMonthName(newsletter.published_date).toLowerCase().includes(query)
      );
    }

    // Year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(newsletter => 
        new Date(newsletter.published_date).getFullYear() === selectedYear
      );
    }

    // Month filter
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(newsletter => 
        getMonthName(newsletter.published_date) === selectedMonth
      );
    }

    setFilteredNewsletters(filtered);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMonthName = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long' });
  };

  const getMonthYear = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'long' })} ${date.getFullYear()}`;
  };

  // Get unique years and months for filters
  const years = Array.from(new Set(newsletters.map(newsletter => 
    new Date(newsletter.published_date).getFullYear()
  ))).sort((a, b) => b - a);

  const months = Array.from(new Set(newsletters.map(newsletter => 
    getMonthName(newsletter.published_date)
  ))).sort((a, b) => {
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthOrder.indexOf(a) - monthOrder.indexOf(b);
  });

  const handleDownload = async (newsletter: ClubNewsletter) => {
    try {
      // Create a temporary link for download
      const link = document.createElement('a');
      link.href = newsletter.file_url;
      link.download = newsletter.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback: open in new tab if download fails
      window.open(newsletter.file_url, '_blank');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedYear('all');
    setSelectedMonth('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            CLUB NEWSLETTERS
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access all club newsletters and communications
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, description, location, or month..."
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Filter by Year
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Filter by Month
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="all">All Months</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing {filteredNewsletters.length} of {newsletters.length} newsletters
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || selectedYear !== 'all' || selectedMonth !== 'all') && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading club newsletters...</p>
          </div>
        )}

        {/* No Results State */}
        {!loading && filteredNewsletters.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {searchQuery || selectedYear !== 'all' || selectedMonth !== 'all' 
                ? 'No newsletters found matching your criteria'
                : 'No newsletters available'
              }
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery || selectedYear !== 'all' || selectedMonth !== 'all'
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'There are no club newsletters available at the moment. Please check back later.'
              }
            </p>
            {(searchQuery || selectedYear !== 'all' || selectedMonth !== 'all') && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Newsletters List */}
        {!loading && filteredNewsletters.length > 0 && (
          <div className="space-y-4">
            {filteredNewsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Newsletter Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {newsletter.title}
                        </h3>
                        
                        {newsletter.description && (
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {newsletter.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{getMonthYear(newsletter.published_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Published: {formatDate(newsletter.published_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Size: {formatFileSize(newsletter.file_size)}</span>
                          </div>
                          {newsletter.location && (
                            <div className="flex items-center gap-1">
                              <span>Location: {newsletter.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* File info */}
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                          <FileText className="h-4 w-4" />
                          <span>File: {newsletter.file_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(newsletter)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap flex-shrink-0"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}