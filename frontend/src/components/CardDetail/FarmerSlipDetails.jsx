import FarmerDetails from "./FarmerDetails";
import FarmerAndDokanSlip from "./FarmerAndDokanSlip";

const FarmerSlipDetails = ({ individualFarmerData, individualCardDetails }) => {
  return (
    <>
      {individualFarmerData || individualCardDetails ? (
        <div className="row mb-2">
          <h2 className="my-4 py-2 text-center font-weight-bold">
            হিসাবের বিবরণ
          </h2>
          {individualFarmerData && (
            <FarmerDetails individualFarmerData={individualFarmerData} />
          )}

          {individualCardDetails && (
            <FarmerAndDokanSlip individualCardDetails={individualCardDetails} />
          )}
        </div>
      ) : null}
    </>
  );
};

export default FarmerSlipDetails;
