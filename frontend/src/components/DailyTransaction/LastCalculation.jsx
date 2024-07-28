const LastCalculation =({totalJoma,totalKhoroch,remainingBalance})=>{
    return (
        <>
        <div className="row mb-4">
            <div className="col-md-6 mx-auto">
              <div className="card">
                <div className="card-header text-center font-weight-bold">
                  সারাংশ
                </div>
                <div className="card-body text-center">
                  <p className="font-weight-bold">
                    মোট খরচ: {totalKhoroch} টাকা
                  </p>
                  <p className="font-weight-bold">মোট জমা: {totalJoma} টাকা</p>
                  <p className="font-weight-bold">
                    বাকি টাকা: {remainingBalance} টাকা
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}
export default LastCalculation;