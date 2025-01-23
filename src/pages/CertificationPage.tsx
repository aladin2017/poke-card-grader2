import { useParams } from "react-router-dom";
import { CardVerification } from "@/components/CardVerification";

const CertificationPage = () => {
  const { ean8 } = useParams();
  
  return (
    <div className="min-h-screen">
      <CardVerification initialEan8={ean8} />
    </div>
  );
};

export default CertificationPage;