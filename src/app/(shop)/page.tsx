export default function HomePage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Moroccan Organica
                    </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Discover the finest organic products from Morocco. Pure, natural, and ethically sourced.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg">
                        Shop Now
                    </button>
                    <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-all">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    )
}
