import PurchaseService from '../ServicesModels/PurchaseService.js';
class PurchaseController{
  constructor(){
    this.PurchaseService = new PurchaseService();
  }
  convertPoints = async (req, res) => {
    try {
      const response = await this.PurchaseService.fetchData("convertPoints", {} ,req.body)  // ??
      if(response){
        res.send(response.data);
      } else {
        res.sendStatus(404);
      }
    } catch(err){
      res.send(err.message);
    }
  }

  purchase = async (req, res) => {
    try {
      const response = await this.PurchaseService.fetchData("purchase", req.params, req.body) // ??
      if(response){
        res.send(response.data);
      } else {
        res.sendStatus(404);
      }
    } catch(err){
      res.send(err.message);
    }
  }


}

export default PurchaseController;


