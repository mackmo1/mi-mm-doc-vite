import db from "../config/db.js";

class Branches2{
    constructor(branch2){
        this.id=branch2.id;
        this.branch_id=branch2.branch_id;
        this.title=branch2.title;
        this.content=branch2.content;
        this.isShow=branch2.isShow;
        this.isAdd=branch2.isAdd;
    }
    save(){
        const sql =`INSERT INTO branches2(id,branch_id,title,content,isShow,isAdd)
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
            db.query(`SELECT * FROM branches2`,(err,results)=>{
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
            db.query(`SELECT * FROM branches2 WHERE id=?`,[id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
    static findByIdAndUpdate(id,branch1){
        return new Promise((resolve,reject)=>{
            db.query(`UPDATE branches2 SET? WHERE id=?`,[branch1,id],(err,results)=>{
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
            db.query(`DELETE FROM branches2 WHERE id=?`,[id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
}

export default Branches2;