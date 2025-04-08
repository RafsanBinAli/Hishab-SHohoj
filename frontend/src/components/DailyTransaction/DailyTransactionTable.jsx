import React from "react";
const DailyTransactionTable = ({ title, data }) => {
  return (
    <div className="card">
      <div className="card-body table-responsive">
        <h4 className="daily-transaction-table-title">{title}</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>হিসাবের ধরণ</th>
              <th>নাম</th>
              <th>টাকা</th>
              <th>মোট</th>
            </tr>
          </thead>
          <tbody>
            {data.map((section, sectionIndex) => (
              <React.Fragment key={sectionIndex}>
                <tr>
                  <td className="font-weight-bold">{section.title}</td>
                  <td colSpan="2">
                    <div
                      className={
                        Array.isArray(section.transactionData) &&
                        section.transactionData.length > 3
                          ? "scrollable-cell"
                          : ""
                      }
                    >
                      {Array.isArray(section.transactionData) ? (
                        <table className="table table-bordered">
                          <tbody>
                            {section.transactionData.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>
                                  {parseInt(item.amount || item.cost || 0, 10)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>{parseInt(section.transactionData || 0, 10)}</p>
                      )}
                    </div>
                  </td>
                  <td>
                    {Array.isArray(section.transactionData)
                      ? section.transactionData.reduce(
                          (total, item) =>
                            total + parseInt(item.amount || item.cost || 0, 10),
                          0
                        )
                      : parseInt(section.transactionData || 0, 10)}
                  </td>
                </tr>
              </React.Fragment>
            ))}

            <tr className="font-weight-bold">
              <td>মোট</td>
              <td colSpan="2"></td>
              <td>
                {data.reduce((grandTotal, section) => {
                  const sectionTotal = Array.isArray(section.transactionData)
                    ? section.transactionData.reduce(
                        (total, item) =>
                          total + parseInt(item.amount || item.cost || 0, 10), // Ensure int
                        0
                      )
                    : parseInt(section.transactionData || 0, 10); // Ensure int if not array

                  return grandTotal + sectionTotal;
                }, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyTransactionTable;
