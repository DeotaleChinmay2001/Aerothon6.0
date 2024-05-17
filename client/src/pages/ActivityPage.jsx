const Activity = () => {
  const data = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice@example.com",
    },
  ];

  return (
    <div className="flex flex-col py-10 lg:px-16 md:px10 px-6 h-screen overflow-y-auto w-full">
      <h2 className="lg:text-3xl md:text-2xl text-xl">Activity</h2>
      <div className="overflow-x-auto mt-10">
        <div className="overflow-x-auto">
          <table className="items-center w-full bg-white border-collapse shadow-md">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 border-b-2 border-blue-700">ID</th>
                <th className="px-6 py-3 border-b-2 border-blue-700">Name</th>
                <th className="px-6 py-3 border-b-2 border-blue-700">Email</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {item.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Activity;
