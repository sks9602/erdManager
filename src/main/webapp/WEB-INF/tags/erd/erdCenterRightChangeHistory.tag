<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

                {   xtype : 'gridpanel',
                    // region: 'center',
                    columnLines: true,
                    id : 'centerRightChangeHistory_gridpanel',
                    // scrollable:true,
                    title: '변경이력',
                    plugins: [{
                        ptype: 'gridfilters'
                    }],
                    <tagErd:store type="store" id="columnChangeLogStore" idProperty="LOG_ID" url="/project/data/chgLogList.do" rootProperty="data" expanded="false" params="ENTITY_ID : ''" autoLoad="true">
                      // fields: store.tag로 이동
                    </tagErd:store>
                    // reference: 'grid1',
                    tbar : ['->',
                        <tagErd:button type="button" label="리로드" iconCls="search" cls="btn_segmentedbutton">
                            listeners : {
                                click : function(_this, e, eOpts) { 
                                    var store = Ext.getStore("columnChangeLogStore");
                                    store.reload();
                                }
                            }
                        </tagErd:button>
                    ],
                    columns: [
                        { xtype: 'rownumberer', },
                        { text: '변경 일시', header: '<div style="text-align:center;width:100%;">변경 일시</div>',dataIndex: 'TRT_DT_FMT', align : 'center', width : 120, hidden : false,  sort : true,},
                        { text: '변경 대상', header: '<div style="text-align:center;width:100%;">변경 대상</div>',dataIndex: 'TGT_OBJT_CD_NM', align : 'center', width : 70, hidden : false,  sort : true, },
                        { text: '컬럼 물리 명', header: '<div style="text-align:center;width:100%;">컬럼 물리 명</div>',dataIndex: 'ATTR_NM', align : 'left', width : 130, hidden : false,  sort : true, filter: {type: 'string', dataIndex: 'ATTR_NM'},},
                        { text: '컬럼 논리 명', header: '<div style="text-align:center;width:100%;">컬럼 논리 명</div>',dataIndex: 'COLMN_NM', align : 'left', width : 130, hidden : false,  sort : true, filter: {type: 'string', dataIndex: 'COLMN_NM'},},
                        { text: '변경 내용', header: '<div style="text-align:center;width:100%;">변경 내용</div>', align : 'left', dataIndex: 'CHG_CTNT', width : 90,  sort : false, flex : 1, filter: {type: 'string', dataIndex: 'CHG_CTNT'},},
                    ]
                }, 