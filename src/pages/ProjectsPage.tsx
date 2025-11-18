import { useEffect, useState } from 'react';
import { Target, Filter } from 'lucide-react';
import { ClubProject } from '../types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ClubProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ClubProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Community Service', 'Health', 'Education', 'Environment', 'Youth Service'];

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((project) => project.category === selectedCategory);
      setFilteredProjects(filtered);
    }
  }, [selectedCategory, projects]);

  const loadProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('club_projects')
      .select('*')
      .order('date', { ascending: false });

    if (data) {
      setProjects(data);
      setFilteredProjects(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Club Projects</h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore the impactful projects undertaken by our Rotary clubs across ROTARY TUMKUR PRERANA.
        </p>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-700">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Target size={64} className="text-blue-900" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-900 text-xs font-semibold px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(project.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                  <p className="text-gray-600 line-clamp-4">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Target size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">
              {selectedCategory !== 'All'
                ? `No projects found in ${selectedCategory}`
                : 'No projects found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
