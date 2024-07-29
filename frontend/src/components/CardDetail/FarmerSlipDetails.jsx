import FarmerDetails from "./FarmerDetails";
import FarmerAndDokanSlip from "./FarmerAndDokanSlip";
const FarmerSlipDetails = ({
  individualFarmerData,
  individualCardDetails,
}) => {
  return (
    <>
      <div className="row mb-2">
        {individualFarmerData && (
          <FarmerDetails individualFarmerData={individualFarmerData} />
        )}

        {individualCardDetails && (
          <FarmerAndDokanSlip individualCardDetails={individualCardDetails} />
        )}
      </div>
    </>
  );
};

export default FarmerSlipDetails;
