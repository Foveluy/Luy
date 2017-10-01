import { flattenChildren } from '../app/src/Luy/createElement';

describe('flattenChildren', () => {
    describe('give flattenChildren an array', () => {
        it('[1,2,3,4,5,67,8,8]', () => {
            const ary = flattenChildren([1, 2, 3, 4, 5, 67, 8, 8])
            expect(ary[0]).toEqual({ "key": null, "props": "123456788", "ref": null, "type": "#text" })
        });
        it('[1, 2, 3, { a: 4 }, 5, 67, 8, 8]', () => {
            const ary = flattenChildren([1, 2, 3, { a: 4 }, 5, 67, 8, 8])
            expect(ary).toEqual([{ "key": null, "props": "123", "ref": null, "type": "#text" }, { "a": 4 }, { "key": null, "props": "56788", "ref": null, "type": "#text" }])
        });
        it('1asc', () => {
            const ary = flattenChildren('1asc')
            expect(ary).toEqual({ "key": null, "props": "1asc", "ref": null, "type": "#text" }, { "a": 4 })
        });
        it('[{a:123},2,3]', () => {
            const ary = flattenChildren([{a:123},2,3])
            expect(ary).toEqual([{"a": 123}, {"key": null, "props": "23", "ref": null, "type": "#text"}])
        });

        it('[[1,2,3],"sss"]', () => {
            const ary = flattenChildren([[1,2,3],"sss"])
            expect(ary).toEqual([1,2,3, {"key": null, "props": "sss", "ref": null, "type": "#text"}])
        });
        it('[[1,2,3],"sss",[1,2,3]]', () => {
            const ary = flattenChildren([[1,2,3],"sss",[1,2,3]])
            expect(ary).toEqual([1,2,3, {"key": null, "props": "sss", "ref": null, "type": "#text"},1,2,3])
        });
        it('[[1,2,3],"sss","sss",[1,2,3]]', () => {
            const ary = flattenChildren([[1,2,3],"sss","sss",[1,2,3]])
            expect(ary).toEqual([1,2,3, {"key": null, "props": "ssssss", "ref": null, "type": "#text"},1,2,3])
        });
        it('[[1,2,3],"sss",[1,2,3],"sss"]', () => {
            const ary = flattenChildren([[1,2,3],"sss",[1,2,3],"sss",])
            expect(ary).toEqual([1,2,3, {"key": null, "props": "sss", "ref": null, "type": "#text"},1,2,3,{"key": null, "props": "sss", "ref": null, "type": "#text"}])
        });
    });
});