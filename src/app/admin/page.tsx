export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Orders</h3>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900">0 MAD</p>
                </div>
            </div>
        </div>
    )
}
