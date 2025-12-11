import db from "../config/db.js";

class Branches5{
    constructor(branch5){
        this.id=branch5.id;
        this.branch_id=branch5.branch_id;
        this.title=branch5.title;
        this.content=branch5.content;
        this.isShow=branch5.isShow;
        this.isAdd=branch5.isAdd;
    }
    save(){
        const sql = `INSERT INTO branches5(id,branch_id,title,content,isShow,isAdd)
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
            db.query(`SELECT * FROM branches5`,(err,results)=>{
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
            db.query(`SELECT * FROM branches5 WHERE id=?`,[id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            })
        })
    }

    static findByIdAndUpdate(id,branch5){
        return new Promise((resolve,reject)=>{
            db.query(`UPDATE branches5 SET? WHERE id=?`,[branch5,id],(err,results)=>{
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
            db.query(`DELETE FROM branches5 WHERE id=?`,[id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
}

export default Branches5;