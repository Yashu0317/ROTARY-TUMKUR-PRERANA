import { useEffect, useState } from 'react';
import { BookOpen, Download } from 'lucide-react';
import { Newsletter } from '../types';

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewsletters();
  }, []);

  const loadNewsletters = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('newsletters')
      .select('*')
      .order('published_date', { ascending: false });

    if (data) setNewsletters(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">District Newsletters</h1>
        <p className="text-lg text-gray-600 mb-12">
          Stay updated with the latest news, stories, and achievements from across ROTARY TUMKUR PRERANA.
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          </div>
        ) : newsletters.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpen size={24} className="text-blue-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{newsletter.title}</h3>
                    <p className="text-sm text-gray-600">
                      {newsletter.month} {newsletter.year}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  Published on {new Date(newsletter.published_date).toLocaleDateString()}
                </p>

                {newsletter.pdf_url ? (
                  <a
                    href={newsletter.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    <Download size={18} />
                    Download PDF
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 bg-gray-300 text-gray-600 px-4 py-2 rounded-lg font-semibold cursor-not-allowed w-full"
                  >
                    <Download size={18} />
                    PDF Not Available
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No newsletters available at this time</p>
          </div>
        )}
      </div>
    </div>
  );
}
