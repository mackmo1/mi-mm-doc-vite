import db from "../config/db.js";

class Branches4{
    constructor(branch4){
        this.id=branch4.id;
        this.branch_id=branch4.branch_id;
        this.title=branch4.title;
        this.content=branch4.content;
        this.isShow=branch4.isShow;
        this.isAdd=branch4.isAdd;
    }

    save(){
        const sql = `INSERT INTO branches4(id,branch_id,title,content,isShow,isAdd)
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
            db.query(`SELECT * FROM branches4`,(err,results)=>{
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
            db.query(`SELECT * FROM branches4 WHERE id=?`,[id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            })
        })
    }

    static findByIdAndUpdate(id,branch4){
        return new Promise((resolve,reject)=>{
            db.query(`UPDATE branches4 SET? WHERE id=?`,[branch4,id],(err,results)=>{
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
            db.query(`DELETE FROM branches4 WHERE id=?`,[id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
}

export default Branches4;