const SummaryTable = ({ data, category, onRowClick }) => {
    const groupedByDate = data.reduce((acc, row) => {
        const dateKey = row.date;
        if (!acc[dateKey]) acc[dateKey] = { date: dateKey };

        if (category === "OPD → Wellness") {
            acc[dateKey].converted = row.count;
        } else {
            if (row.type === "New") acc[dateKey].newCount = row.count;
            if (row.type === "Repeat") acc[dateKey].repeatCount = row.count;
        }

        return acc;
    }, {});

    const rows = Object.values(groupedByDate);

    return (
        <div className="card p-3 mt-4">
            <h5>Customer Summary</h5>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Date</th>
                        {category === "OPD → Wellness" ? (
                            <th>Converted Count</th>
                        ) : (
                            <>
                                <th>New Count</th>
                                <th>Repeat Count</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            <td>{new Date(row.date).toLocaleDateString('en-CA')}</td>

                            {category === "OPD → Wellness" ? (
                                <td
                                    onClick={() =>
                                        onRowClick({
                                            date: row.date,
                                            type: "Converted",
                                        })
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    {row.converted || 0}
                                </td>
                            ) : (
                                <>
                                    <td
                                        onClick={() =>
                                            onRowClick({
                                                date: row.date,
                                                type: "New",
                                            })
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        {row.newCount || 0}
                                    </td>
                                    <td
                                        onClick={() =>
                                            onRowClick({
                                                date: row.date,
                                                type: "Repeat",
                                            })
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        {row.repeatCount || 0}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SummaryTable;
