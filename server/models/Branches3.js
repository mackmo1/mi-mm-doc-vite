import db from "../config/db.js";

class Branches3 {
    constructor(branch3){
        this.id=branch3.id;
        this.branch_id=branch3.branch_id;
        this.title=branch3.title;
        this.content=branch3.content;
        this.isShow=branch3.isShow;
        this.isAdd=branch3.isAdd;
    }
    save(){
        const sql = `INSERT INTO branches3(id,branch_id,title,content,isShow,isAdd)
        VALUES(${this.id},${this.branch_id},'${this.title}','${this.content}','${this.isShow}','${this.isAdd}')`;
        return new Promise((resolve,reject)=>{
            db.query(sql,(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
    static findAll(){
        return new Promise((resolve,reject)=>{
            db.query(`SELECT * FROM branches3`,(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
    static findById(id){
        return new Promise((resolve,reject)=>{
            db.query(`SELECT * FROM branches3 WHERE id=?`,[id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
    static findByIdAndUpdate(id,branch3){
        return new Promise((resolve,reject)=>{
            db.query(`UPDATE branches3 SET? WHERE id=?`,[branch3,id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
    static findByIdAndDelete(id){
        return new Promise((resolve,reject)=>{
            db.query(`DELETE FROM branches3 WHERE id=?`,[id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
}

export default Branches3;