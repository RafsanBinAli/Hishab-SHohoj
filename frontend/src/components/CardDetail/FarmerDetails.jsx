const FarmerDetails = ({ individualFarmerData }) => {
  return (
    <>
      <div className="col-md-4 ml-10">
        <div className="card-body">
          <h5 className="header-title">কৃষকের Porichoy</h5>
          <div className="flex">
            <span>Name</span> : <p> {individualFarmerData?.name}</p>
            <span>Village</span> : <p> {individualFarmerData?.village}</p>
            <span>Mobile No:</span>
            <p> {individualFarmerData?.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="col-1 d-flex align-items-center justify-content-center">
        <div className="vr"></div> {/* Vertical divider */}
      </div>
    </>
  );
};
export default FarmerDetails;
