import { useEffect, useState } from 'react';
import { Search, FileText, Download, Calendar, Filter } from 'lucide-react';
// import supabase from '../lib/supabase';


interface GovernorLetter {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
  month: string;
  year: number;
  keywords?: string[];
}

export default function GovernorsLettersPage() {
  const [letters, setLetters] = useState<GovernorLetter[]>([]);
  const [filteredLetters, setFilteredLetters] = useState<GovernorLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string | 'all'>('all');

  useEffect(() => {
    loadGovernorsLetters();
  }, []);

  useEffect(() => {
    filterLetters();
  }, [letters, searchQuery, selectedYear, selectedMonth]);

  const loadGovernorsLetters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('governors_letters')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error loading letters:', error);
        return;
      }

      if (data) {
        setLetters(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLetters = () => {
    let filtered = letters;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(letter =>
        letter.title.toLowerCase().includes(query) ||
        letter.keywords?.some(keyword => keyword.toLowerCase().includes(query)) ||
        letter.month.toLowerCase().includes(query)
      );
    }

    // Year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(letter => letter.year === selectedYear);
    }

    // Month filter
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(letter => letter.month === selectedMonth);
    }

    setFilteredLetters(filtered);
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

  // Get unique years and months for filters
  const years = Array.from(new Set(letters.map(letter => letter.year))).sort((a, b) => b - a);
  const months = Array.from(new Set(letters.map(letter => letter.month))).sort();

  const handleDownload = async (letter: GovernorLetter) => {
    try {
      // Create a temporary link for download
      const link = document.createElement('a');
      link.href = letter.file_url;
      link.download = letter.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            GOVERNOR'S MONTHLY LETTER
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access all monthly letters and communications from the Governor
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
              placeholder="Enter Keywords..."
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
                Showing {filteredLetters.length} of {letters.length} letters
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Governor's letters...</p>
          </div>
        )}

        {/* No Results State */}
        {!loading && filteredLetters.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {searchQuery || selectedYear !== 'all' || selectedMonth !== 'all' 
                ? 'No letters found matching your criteria'
                : 'No record found!'
              }
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery || selectedYear !== 'all' || selectedMonth !== 'all'
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'There are no Governor\'s letters available at the moment. Please check back later.'
              }
            </p>
            {(searchQuery || selectedYear !== 'all' || selectedMonth !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedYear('all');
                  setSelectedMonth('all');
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Letters List */}
        {!loading && filteredLetters.length > 0 && (
          <div className="space-y-4">
            {filteredLetters.map((letter) => (
              <div
                key={letter.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Letter Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {letter.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{letter.month} {letter.year}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Size: {formatFileSize(letter.file_size)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Uploaded: {formatDate(letter.uploaded_at)}</span>
                          </div>
                        </div>
                        {letter.keywords && letter.keywords.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {letter.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(letter)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
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