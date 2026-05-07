import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, User, ChevronRight, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { editorialPosts, BlogPost } from '../data/editorial';
import { Separator } from '@/components/ui/separator';
import SEO from '../components/SEO';

export default function Editorial() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="pt-24 min-h-screen bg-[#0A0A0B]">
      <SEO 
        title={selectedPost ? selectedPost.title : "Editorial Journal"} 
        description={selectedPost ? selectedPost.excerpt : "Deep dives into AI exploration, creative coding, and the culture of building weird things. No fluff, just pure signal."}
        ogImage={selectedPost?.image}
        ogType={selectedPost ? "article" : "website"}
        keywords={selectedPost ? [...selectedPost.tags, "editorial", "blog"] : ["creative coding", "AI research", "tech journal", "Vibes & Highs"]}
      />
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="mb-20">
                <div className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-4 flex items-center gap-4">
                  <div className="h-px w-12 bg-primary"></div>
                  EDITORIAL_JOURNAL / V0.1
                </div>
                <h1 className="font-display font-black text-6xl md:text-8xl tracking-tighter leading-none mb-6">
                  LATENT<br />
                  <span className="font-serif italic font-light text-white/50">&amp; Logic.</span>
                </h1>
                <p className="text-white/60 text-xl font-light max-w-2xl leading-relaxed">
                  Deep dives into AI exploration, creative coding, and the culture of building weird things. No fluff, just pure signal.
                </p>
              </div>

              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {editorialPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="relative aspect-16/10 overflow-hidden mb-6 border border-white/10 group-hover:border-primary/50 transition-colors">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/80 backdrop-blur-md border border-white/10 text-[8px] font-bold uppercase tracking-widest px-2 py-1 text-primary">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                        <span className="flex items-center gap-1.5"><User size={12} /> {post.author}</span>
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-white/50 text-sm font-light leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="pt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-primary group-hover:gap-2 transition-all">
                        Read Article <ChevronRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="post"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <Button
                variant="ghost"
                onClick={() => setSelectedPost(null)}
                className="mb-12 hover:bg-white/5 text-white/60 hover:text-primary transition-colors group px-0"
              >
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Journal
              </Button>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{selectedPost.category}</span>
                    <Separator orientation="vertical" className="h-4 bg-white/20" />
                    <span className="text-[10px] font-mono text-white/40">{selectedPost.date}</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/60 pt-4">
                    <div className="flex items-center gap-2 text-white"><User size={14} className="text-primary" /> {selectedPost.author}</div>
                    <div className="flex items-center gap-2 text-white"><Clock size={14} className="text-primary" /> {selectedPost.readTime} READ</div>
                  </div>
                </div>

                <div className="aspect-video w-full overflow-hidden border border-white/10">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="grid md:grid-cols-[1fr_200px] gap-12">
                  <div 
                    className="prose prose-invert max-w-none text-white/80 font-light leading-relaxed text-lg
                      [&>h3]:text-white [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:tracking-tight [&>h3]:mt-12 [&>h3]:mb-6
                      [&>p]:mb-6 [&>blockquote]:border-l-primary [&>blockquote]:bg-white/5 [&>blockquote]:p-6 [&>blockquote]:italic [&>blockquote]:text-primary"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  />
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPost.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-mono border border-white/10 bg-white/5 px-2 py-1 hover:border-primary/30 transition-colors cursor-default">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="bg-white/10" />
                    
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40">Share</h4>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-none border-white/10 hover:border-primary/50 hover:bg-primary/5">
                          <Share2 size={16} />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-none border-white/10 hover:border-primary/50 hover:bg-primary/5">
                          <BookOpen size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
