import db from "../config/db.js";

class Branches1 {
    constructor(branch1){
        this.id = branch1.id;
        this.title = branch1.title;
        this.content = branch1.content;
        this.isShow = branch1.isShow;
        this.isAdd = branch1.isAdd;
    }
    save(){
        const sql = `INSERT INTO branches1(id,title,content,isShow,isAdd)
        VALUES(${this.id},'${this.title}','${this.content}','${this.isShow}','${this.isAdd}');`;
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
            db.query(`SELECT * FROM branches1`,(err,results)=>{
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
            db.query(`SELECT * FROM branches1 WHERE id=?`,[id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
    static findByIdAndUpdate(id,branch){
        return new Promise((resolve,reject)=>{
            db.query(`UPDATE branches1 SET? WHERE id=?`,[branch,id],(err,results)=>{
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
            db.query(`DELETE FROM branches1 WHERE id=?`,[id],(err,results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            })
        })
    }
}

export default Branches1;